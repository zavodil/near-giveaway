/*
 * This is an example of a Rust smart contract with two simple, symmetric functions:
 *
 * 1. set_greeting: accepts a greeting, such as "howdy", and records it for the user (account_id)
 *    who sent the request
 * 2. get_greeting: accepts an account_id and returns the greeting saved for it, defaulting to
 *    "Hello"
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://github.com/near/near-sdk-rs
 *
 */

// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_lib::types::{WrappedBalance, WrappedDuration, Duration};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::wee_alloc;
use near_sdk::{env, near_bindgen, AccountId, Balance, Promise, Gas, ext_contract};

use std::collections::HashMap;


#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

const MAX_DRAW_SIZE: usize = 32;
const MIN_DEPOSIT_AMOUNT: u128 = 1_000_000_000_000_000_000_000_000;
const MAX_DESCRIPTION_LENGTH: usize = 280;
const MAX_TITLE_LENGTH: usize = 128;

const SERVICE_COMMISSION: Balance = 10_000_000_000_000_000_000;

const BASE: Gas = 25_000_000_000_000;

#[ext_contract(multisender)]
pub trait ExtMultisender {
    fn multisend_attached_tokens(&self, accounts: Vec<Payout>);
}


#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Event {
    owner_account_id: AccountId,
    status: EventStatus,
    rewards: Vec<WrappedBalance>,

    participants: Vec<AccountId>,
    allow_duplicate_participants: bool,
    add_participants_start: WrappedDuration,
    add_participants_end: WrappedDuration,
    event: WrappedDuration,
    finalized: WrappedDuration,

    title: String,
    description: String
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct EventInput {
    rewards: Vec<WrappedBalance>,
    participants: Vec<AccountId>,
    allow_duplicate_participants: bool,

    add_participants_start: WrappedDuration,
    add_participants_end: WrappedDuration,
    event: WrappedDuration,

    title: String,
    description: String
}

#[derive(BorshSerialize, BorshDeserialize, Eq, PartialEq, Debug, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum EventStatus {
    Pending,
    Success,
}

#[derive(Debug, Clone, BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Payout {
    pub account_id: AccountId,
    pub amount: WrappedBalance,
}

type EventId = u64;
type Payouts = UnorderedMap<EventId, Vec<Payout>>;
type Events = UnorderedMap<EventId, Event>;

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Giveaway {
    active: bool,
    events: Events,
    payouts: Payouts,
}

impl Default for Giveaway {
    fn default() -> Self {
        Self {
            active: true,
            events: UnorderedMap::new(b"e".to_vec()),
            payouts: UnorderedMap::new(b"p".to_vec()),
        }
    }
}

#[near_bindgen]
impl Giveaway {
    #[init]
    pub fn new() -> Self {
        assert!(!env::state_exists(), "The contract is already initialized");
        let giveaway = Self {
            active: true,
            events: UnorderedMap::new(b"e".to_vec()),
            payouts: UnorderedMap::new(b"p".to_vec()),
        };
        giveaway
    }

    fn get_multisender_contract() -> String {
        //  multisender.app.near for Mainnet, dev-1611689128537-1966413 for Testnet
        "dev-1611689128537-1966413".to_string()
    }

    #[payable]
    pub fn add_event(&mut self, event: EventInput) -> u64 {
        let tokens: Balance = near_sdk::env::attached_deposit();

        assert!(tokens >= MIN_DEPOSIT_AMOUNT, "Not enough deposit");
        assert!(event.rewards.len() < MAX_DRAW_SIZE, "Too many rewards");
        assert!(event.rewards.len() > 0, "Missing rewards");

        assert!(event.description.len() < MAX_DESCRIPTION_LENGTH, "Description length is too long");
        assert!(event.title.len() < MAX_TITLE_LENGTH, "Title length is too long");

        assert!(
            env::block_timestamp() <= event.add_participants_end.into() || event.participants.len() > 0,
            "Abort. Update `add_participants_end` or provide participants"
        );

        let event_id = self.events.len() as u64;
        let owner_id = env::predecessor_account_id();

        let mut total: Balance = 0;
        for amount in &event.rewards {
            total += amount.0;
        }

        let payment: Balance = total + SERVICE_COMMISSION;

        assert!(
            payment <= tokens,
            "Not enough attached tokens to provide rewards (Attached: {}. Total rewards: {}, Service commission: {})",
            tokens, total, SERVICE_COMMISSION
        );

        if payment < tokens {
            let tokens_to_return = tokens - payment;
            env::log(
                format!(
                    "@{} withdrawing extra {}",
                    owner_id, tokens_to_return
                ).as_bytes(),
            );
            Promise::new(owner_id.clone()).transfer(tokens_to_return);
        }

        let e = Event {
            status: EventStatus::Pending,
            owner_account_id: owner_id,
            rewards: event.rewards,
            participants: event.participants,
            allow_duplicate_participants: event.allow_duplicate_participants,

            add_participants_start: event.add_participants_start.into(),
            add_participants_end: event.add_participants_end.into(),
            event: event.event.into(),
            finalized: 0.into(),

            title: event.title,
            description: event.description
        };
        self.events.insert(&event_id, &e);
        event_id
    }

    pub fn insert_participants(&mut self, event_id: u64, participants: Vec<AccountId>) -> bool {
        match self.events.get(&event_id) {
            Some(mut event) => {
                assert!(event.status == EventStatus::Pending, "Already finalized");

                let current_timestamp: Duration = env::block_timestamp();
                assert!(
                    current_timestamp >= event.add_participants_start.into(),
                    "It's too early to add participants. Please wait for block {}. Current blocK: {}",
                    event.add_participants_start.0, current_timestamp
                );

                assert!(
                    current_timestamp <= event.add_participants_end.into(),
                    "It's too late to add participants. Process finished at block {}. Current blocK: {}",
                    event.add_participants_end.0, current_timestamp
                );

                let account_id = env::predecessor_account_id();
                assert!(
                    event.owner_account_id == account_id,
                    "User @{} doesn't have access to this event. Current owner: @{}",
                    account_id, event.owner_account_id
                );

                for participant in participants {
                    if !(!event.allow_duplicate_participants && event.participants.contains(&participant)) {
                        event.participants.push(participant)
                    }
                }

                self.events.insert(&event_id, &event);

                true
            }
            None => {
                env::log(format!("Unknown event").as_bytes());
                false
            }
        }
    }

    pub fn finalize_event(&mut self, event_id: u64) -> bool {
        // TODO check blocks
        match self.events.get(&event_id) {
            Some(mut event) => {
                assert!(event.status == EventStatus::Pending, "Already finalized");
                assert!(event.rewards.len() > 0, "Rewards Missing");
                assert!(event.participants.len() > 0, "Participants Missing");

                assert!(
                    env::block_timestamp() >= event.event.into(),
                    "It's too early to finalize the event. Please wait for block {}",
                    event.event.0
                );

                event.status = EventStatus::Success;
                event.finalized = env::block_timestamp().into();
                self.events.insert(&event_id, &event);

                let mut payouts: Vec<Payout> = vec![];
                let mut winners: Vec<AccountId> = vec![];
                let max_participants: usize = event.participants.len();
                let max_rewards: usize = event.rewards.len();
                let mut index = 0;
                let seed = near_sdk::env::random_seed();
                let mut total: Balance = 0;
                for reward in event.rewards {
                    let mut winner_account_id: AccountId = "".to_string();

                    while winners.contains(&winner_account_id) || winner_account_id == "" {
                        if winner_account_id != "" {
                            index += 1;
                        } else {
                            if winners.len() >= event.participants.len() {
                                // TODO return the rest
                                env::log(
                                    format!("All participants got prizes. Return the rest to the event owner",
                                    ).as_bytes(),
                                );
                                winner_account_id = "".to_string();
                                break;
                            }
                        }
                        let winner_index: u64 = u64::from(seed[index]) % (max_participants as u64);
                        winner_account_id = event.participants[winner_index as usize].clone();

                        if index >= MAX_DRAW_SIZE {
                            index = 0;
                            env::log(
                                format!("Reset index").as_bytes(),
                            );
                        }
                    }

                    if winner_account_id != "" {
                        winners.push(winner_account_id.clone());
                        let payout = Payout {
                            account_id: winner_account_id.clone(),
                            amount: reward,
                        };
                        total += reward.0;
                        payouts.push(payout);

                        env::log(
                            format!("@{} won reward of {}yNEAR",
                                    winner_account_id, reward.0).as_bytes(),
                        );
                    }

                    if payouts.len() >= max_rewards {
                        break;
                    }

                    index += 1;
                    if index >= MAX_DRAW_SIZE {
                        index = 0;
                        env::log(
                            format!("Reset index").as_bytes(),
                        );
                    }
                }

                multisender::multisend_attached_tokens(payouts.clone(), &Giveaway::get_multisender_contract(), total, BASE);

                self.payouts.insert(&event_id, &payouts);
                true
            }
            None => {
                env::log(format!("Unknown event").as_bytes());
                false
            }
        }
    }

    pub fn get_events_to_finalize(&self, from_index: u64, limit: u64) -> HashMap<u64, Event> {
        let current_timestamp = env::block_timestamp();
        (from_index..std::cmp::min(from_index + limit, self.events.len()))
            .filter(|index| {
                let event =self.events.get(&index.clone()).unwrap();
                event.status == EventStatus::Pending && current_timestamp >= event.event.into()
            })
            .map(|index| (index, self.events.get(&index).unwrap()))
            .collect()
    }

    pub fn get_events(&self, from_index: u64, limit: u64) -> HashMap<u64, Event> {
        (from_index..std::cmp::min(from_index + limit, self.events.len()))
            .map(|index| (index, self.events.get(&index).unwrap()))
            .collect()
    }

    pub fn get_event(&self, id: u64) -> Option<Event> {
        match self.events.get(&id) {
            Some(event) => Some(event),
            None => None,
        }
    }

    pub fn get_payout(&self, event_id: u64) -> Option<Vec<Payout>> {
        match self.payouts.get(&event_id) {
            Some(payout) => Some(payout),
            None => None,
        }
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 *
 * To run from contract directory:
 * cargo test -- --nocapture
 *
 * From project root, to run in combination with frontend tests:
 * yarn test
 *
 */
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    fn set_then_get_greeting() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Giveaway::default();
        contract.set_greeting("howdy".to_string());
        assert_eq!(
            "howdy".to_string(),
            contract.get_greeting("bob_near".to_string())
        );
    }

    #[test]
    fn get_default_greeting() {
        let context = get_context(vec![], true);
        testing_env!(context);
        let contract = Giveaway::default();
        // this test did not call set_greeting so should return the default "Hello" greeting
        assert_eq!(
            "Hello".to_string(),
            contract.get_greeting("francis.near".to_string())
        );
    }
}
