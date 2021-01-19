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
use near_lib::types::{Duration, WrappedBalance, WrappedDuration};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::wee_alloc;
use near_sdk::{env, near_bindgen, AccountId, Balance, Promise};

use std::collections::HashMap;


#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

//const MIN_DEPOSIT_AMOUNT: u128 = 1_000_000_000_000_000_000_000_000;
const MIN_DEPOSIT_AMOUNT: u128 = 1_000_000_000_000_000_000;
const MAX_DESCRIPTION_LENGTH: usize = 280;

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Event {
    owner_account_id: AccountId,
    status: EventStatus,
    rewards: Vec<WrappedBalance>,

    participants: Vec<AccountId>,
    allow_duplicate_participants: bool,
    add_participants_start_date: WrappedDuration,
    add_participants_end_date: WrappedDuration,
    event_date: WrappedDuration,

    title: String,
    description: String,
    image: String,
    link: String,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct EventInput {
    rewards: Vec<WrappedBalance>,
    participants: Vec<AccountId>,
    allow_duplicate_participants: bool,

    add_participants_start_date: WrappedDuration,
    add_participants_end_date: WrappedDuration,
    event_date: WrappedDuration,

    title: String,
    description: String,
    image: String,
    link: String,
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
    pub amount: Balance,
}


type Payouts = UnorderedMap<AccountId, Vec<Payout>>;
type Events = UnorderedMap<u64, Event>;

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

    #[payable]
    pub fn add_event(&mut self, event: EventInput) -> u64 {
        let tokens: Balance = near_sdk::env::attached_deposit();
//TODO: check asserts
        assert!(tokens >= MIN_DEPOSIT_AMOUNT, "Not enough deposit");
        assert!(
            event.description.len() < MAX_DESCRIPTION_LENGTH,
            "Description length is too long"
        );

        let event_id = self.events.len() as u64;
        let owner_id = env::predecessor_account_id();

        let mut total: Balance = 0;
        for amount in &event.rewards {
            total += amount.0;
        }

        assert!(
            total <= tokens,
            "Not enough attached tokens to provide rewards (Attached: {}. Total rewards: {})",
            tokens, total
        );

        if total < tokens {
            let tokens_to_return = tokens - total;
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

            add_participants_start_date: event.add_participants_start_date.into(),
            add_participants_end_date: event.add_participants_end_date.into(),
            event_date: event.event_date.into(),

            title: event.title,
            description: event.description,
            image: event.image,
            link: event.link,
        };
        self.events.insert(&event_id, &e);
        event_id
    }

    pub fn insert_participants(&mut self, event_id: u64, participants: Vec<AccountId>) -> bool {
        match self.events.get(&event_id) {
            Some(mut event) => {
                let account_id = env::predecessor_account_id();
                assert!(
                    event.owner_account_id == account_id,
                    "User @{} doesn't have access to this event. Current owner: @{}",
                    account_id, event.owner_account_id
                );

                for participant in participants {
                    // TODO check duplicate participants if allow_duplicate_participants
                    event.participants.push(participant)
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
