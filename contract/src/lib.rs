use near_sdk::{AccountId, Balance, BorshStorageKey, env, ext_contract, Gas, log, near_bindgen, PanicOnDefault, Promise};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupSet, UnorderedMap, UnorderedSet, Vector};
use near_sdk::json_types::{U128, U64};
use near_sdk::serde::{Deserialize, Serialize};

use crate::event::*;
use crate::multisender::*;
use crate::payout::*;
use crate::utils::get_service_fee;

mod event;
mod payout;
mod multisender;
mod whitelist;
mod utils;

type WrappedBalance = U128;
type WrappedDuration = U64;
type Duration = u64;

const MAX_GIVEAWAY_WINNERS: usize = 128;
const MIN_DEPOSIT_AMOUNT: Balance = 10_000_000_000_000_000_000_000;
const MAX_DESCRIPTION_LENGTH: usize = 280;
const MAX_TITLE_LENGTH: usize = 128;

const NO_DEPOSIT: Balance = 0;
const BASE_PAYOUT_PREPARATION_GAS: Gas = Gas(25_000_000_000_000);
const GAS_FOR_AFTER_MULTISEND: Gas = Gas(25_000_000_000_000);
const SERVICE_FEE_NUMERATOR: u64 = 100;
const SERVICE_FEE_DENOMINATOR: u64 = 10000;
const MAX_SERVICE_FEE: Balance = 10_000_000_000_000_000_000_000_000;

#[ext_contract(ext_self)]
pub trait ExtContract {
    fn after_multisend_attached_tokens(
        &mut self,
        event_id: u64,
        accounts: Vec<MultisenderPayout>,
    ) -> bool;
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Giveaway {
    owner_id: AccountId,
    active: bool,
    next_event_id: u64,
    events: UnorderedMap<EventId, Event>,
    payouts: UnorderedMap<EventId, Vec<Payout>>,
    /// Whitelisted tokens. None for native NEAR
    whitelisted_tokens: LookupSet<TokenId>,
    /// Contract of multisender app
    multisender_contract: AccountId,
    total_service_fee: UnorderedMap<Option<TokenId>, Balance>
}

#[derive(BorshStorageKey, BorshSerialize)]
pub(crate) enum StorageKey {
    Events,
    Payouts,
    EventRewards { event_id: u64 },
    EventParticipants { event_id: u64 },
    WhitelistedTokens,
    TotalServiceFee
}

#[near_bindgen]
impl Giveaway {
    #[init]
    pub fn new(owner_id: AccountId, multisender_contract: Option<AccountId>) -> Self {
        //  multisender.app.near for Mainnet, dev-1611689128537-1966413 for Testnet
        Self {
            owner_id,
            active: true,
            next_event_id: 0,
            events: UnorderedMap::new(StorageKey::Events),
            payouts: UnorderedMap::new(StorageKey::Payouts),
            whitelisted_tokens: LookupSet::new(StorageKey::WhitelistedTokens),
            multisender_contract: multisender_contract.unwrap_or_else(|| AccountId::new_unchecked("multisender.app.near".to_string())),
            total_service_fee: UnorderedMap::new(StorageKey::TotalServiceFee),
        }
    }

    pub fn get_multisender_contract(&self) -> AccountId {
        self.multisender_contract.to_owned()
    }

    #[payable]
    pub fn add_event(&mut self, event_input: EventInput) -> u64 {
        self.assert_active();
        self.assert_whitelisted_token(&event_input.rewards_token_id);

        let tokens: Balance = env::attached_deposit();

        let rewards_number = event_input.rewards.len();
        assert!(rewards_number < MAX_GIVEAWAY_WINNERS, "Too many rewards");
        assert!(rewards_number > 0, "Missing rewards");
        assert!(tokens >= MIN_DEPOSIT_AMOUNT, "Not enough deposit");
        assert!(event_input.description.len() < MAX_DESCRIPTION_LENGTH, "Description length is too long");
        assert!(event_input.title.len() < MAX_TITLE_LENGTH, "Title length is too long");

        let current_timestamp: Duration = env::block_timestamp();
        // TODO remove. Difficult to test
        // assert!(current_timestamp < event_input.event_timestamp.0, "Event date already passed");
        assert!(
            current_timestamp < event_input.add_participants_end_timestamp.0 || !event_input.participants.is_empty(),
            "Update `add_participants_end` or provide participants"
        );

        let event_id = self.next_event_id;
        let owner_id = env::predecessor_account_id();

        let mut total: Balance = 0;
        for amount in &event_input.rewards {
            total += amount.0;
        }

        let service_fee = get_service_fee(&total);
        let payment: Balance = total + service_fee;
        self.internal_add_service_fee(&event_input.rewards_token_id, &service_fee);

        assert!(
            payment <= tokens,
            "Not enough attached tokens to provide rewards (Attached: {}. Total rewards: {}, Service commission: {})",
            tokens, total, service_fee
        );

        if payment < tokens {
            let tokens_to_return = tokens - payment;
            log!("@{} withdrawing extra {}", owner_id, tokens_to_return);
            Promise::new(owner_id.clone()).transfer(tokens_to_return);
        }

        let mut rewards = UnorderedSet::new(StorageKey::EventRewards { event_id });
        for input_reward in event_input.rewards {
            rewards.insert(&input_reward);
        }

        let mut participants = Vector::new(StorageKey::EventParticipants { event_id });
        for input_participant in event_input.participants {
            participants.push(&input_participant);
        }

        let event = Event {
            status: EventStatus::Pending,
            owner_account_id: owner_id,
            rewards,
            rewards_token_id: event_input.rewards_token_id,
            participants,
            allow_duplicate_participants: event_input.allow_duplicate_participants,

            add_participants_start_timestamp: event_input.add_participants_start_timestamp,
            add_participants_end_timestamp: event_input.add_participants_end_timestamp,
            event_timestamp: event_input.event_timestamp,
            finalized_timestamp: None,

            title: event_input.title,
            description: event_input.description,
        };
        self.events.insert(&event_id, &event);
        self.next_event_id += 1;

        event_id
    }

    pub fn insert_participants(&mut self, event_id: u64, participants: Vec<AccountId>) {
        self.assert_active();
        let mut event: Event = self.internal_get_event(&event_id);

        assert_eq!(event.status, EventStatus::Pending, "Already finalized");


        let current_timestamp: Duration = env::block_timestamp();
        assert!(current_timestamp >= event.add_participants_start_timestamp.0, "It's too early to add participants");
        assert!(current_timestamp < event.add_participants_end_timestamp.0, "It's too late to add participants");
        assert!(current_timestamp < event.event_timestamp.0, "Event date already passed");

        self.assert_event_owner(&event);

        for participant in participants {
            if event.allow_duplicate_participants || event.participants.to_vec().contains(&participant) {
                event.participants.push(&participant);
            }
        }

        self.events.insert(&event_id, &event);
    }

    pub fn finalize_event(&mut self, event_id: u64) {
        self.assert_active();
        let mut event: Event = self.internal_get_event(&event_id);
        assert_eq!(event.status, EventStatus::Pending, "Already finalized");
        assert!(!event.rewards.is_empty(), "Rewards Missing");
        assert!(!event.participants.is_empty(), "Participants Missing");

        assert!(
            env::block_timestamp() >= event.event_timestamp.0,
            "It's too early to finalize the event. Please wait for block {}",
            event.event_timestamp.0
        );

        event.status = EventStatus::Calculated;
        event.finalized_timestamp = Some(env::block_timestamp().into());
        self.events.insert(&event_id, &event);

        // Total number of distributed payouts
        let mut payouts_number: PayoutIndex = 0;
        let mut winners: Vec<AccountId> = vec![];
        let max_participants: usize = event.participants.len() as usize;
        let max_rewards: PayoutIndex = event.rewards.len() as PayoutIndex;
        let mut index = 0;
        let seed = near_sdk::env::random_seed();
        let mut payouts = self.internal_get_payouts(&event_id);
        for reward in event.rewards.to_vec() {
            let mut winner_account_id: Option<AccountId> = None;

            while winner_account_id.is_none() || winners.contains(&winner_account_id.clone().unwrap()) {
                if winner_account_id.is_some() {
                    index += 1;
                } else if winners.len() >= max_participants {
                    log!("All participants got their prizes");
                    winner_account_id = None;
                    break;
                }
                let winner_index: u64 = u64::from(seed[index]) % (max_participants as u64);
                winner_account_id = Some(event.participants.get(winner_index).unwrap());

                // TODO check this
                if index >= MAX_GIVEAWAY_WINNERS {
                    index = 0;
                    log!("Reset index");
                }
            }

            if let Some(winner_account_id_value) = winner_account_id {
                winners.push(winner_account_id_value.clone());

                payouts.push(Payout {
                    account_id: winner_account_id_value.clone(),
                    amount: reward,
                    token_id: event.rewards_token_id.to_owned(),
                    status: PayoutStatus::Pending,
                });

                payouts_number += 1;

                log!("@{} won reward of {} yNEAR", winner_account_id_value, reward.0);
            }

            if payouts_number >= max_rewards {
                break;
            }

            index += 1;
            if index >= MAX_GIVEAWAY_WINNERS {
                index = 0;
                log!("Reset index");
            }
        }

        self.payouts.insert(&event_id, &payouts);
    }

    pub fn distribute_payouts(&mut self, event_id: u64, from_index: Option<u64>, limit: Option<u64>) -> Promise {
        self.assert_active();
        let event: Event = self.internal_get_event(&event_id);
        assert_eq!(event.status, EventStatus::Calculated, "Distribution is not available");

        let mut accounts: Vec<MultisenderPayout> = [].to_vec();
        let mut total: Balance = 0;

        let from_index = from_index.unwrap_or_default();
        let limit = limit.unwrap_or_else(|| std::cmp::min(event.rewards.len(), event.participants.len()));

        let mut payouts = self.internal_get_payouts(&event_id);

        for index  in from_index..from_index + limit {
            let index = index as usize;
            if let Some(payout) = payouts.get(index) {
                if payout.status == PayoutStatus::Pending {
                    accounts.push({
                        MultisenderPayout {
                            account_id: payout.account_id.to_owned(),
                            token_id: None,
                            amount: payout.amount,
                        }
                    });
                    total += payout.amount.0;
                    payouts[index].status = PayoutStatus::Complete;
                }
            }
        }

        self.payouts.insert(&event_id, &payouts);

        log!("Distributing rewards: {}", total);

        let unspent_gas = env::prepaid_gas() - BASE_PAYOUT_PREPARATION_GAS - GAS_FOR_AFTER_MULTISEND;

        ext_multisender::multisend_attached_tokens(
            accounts.clone(),
            self.multisender_contract.to_owned(),
            total,
            unspent_gas)
       .then(ext_self::after_multisend_attached_tokens(
           event_id,
           accounts,
           env::current_account_id(),
           NO_DEPOSIT,
           GAS_FOR_AFTER_MULTISEND,
       ))
    }

    pub fn close_event(&mut self, event_id: u64) {
        self.assert_active();
        let mut event: Event = self.internal_get_event(&event_id);
        assert_eq!(event.status, EventStatus::Calculated, "Method is not available");

        let payouts = self.internal_get_payouts(&event_id);

        let rewards_num = std::cmp::min(event.rewards.len(), event.participants.len());
        for index in 0..rewards_num {
            let index = index as usize;
            assert_eq!(payouts[index].status, PayoutStatus::Complete, "Payouts still pending");
        }

        log!("All payouts distributed");
        event.status = EventStatus::Distributed;
        self.events.insert(&event_id, &event);
    }
}
