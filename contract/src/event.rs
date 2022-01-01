use near_sdk::collections::{UnorderedSet, Vector};

use crate::*;

pub type EventId = u64;
pub type TokenId = AccountId;

/// Sale information.
#[derive(BorshSerialize, BorshDeserialize)]
pub enum VEvent {
   Current(Event),
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Event {
   pub owner_account_id: AccountId,
   pub status: EventStatus,

   /// list of available rewards
   pub rewards: UnorderedSet<WrappedBalance>,
   /// token of rewards, NEAR for None
   pub rewards_token_id: Option<TokenId>,
   /// list of all participants
   pub participants: Vector<AccountId>,

   pub allow_duplicate_participants: bool,
   pub add_participants_start_timestamp: WrappedDuration,
   pub add_participants_end_timestamp: WrappedDuration,
   pub event_timestamp: WrappedDuration,
   pub finalized_timestamp: Option<WrappedDuration>,

   pub title: String,
   pub description: String
}

impl From<VEvent> for Event {
   fn from(v_event: VEvent) -> Self {
      match v_event {
         VEvent::Current(event) => event,
      }
   }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct EventOutput {
   pub owner_account_id: AccountId,
   pub status: EventStatus,
   pub rewards: Vec<WrappedBalance>,
   pub rewards_token_id: Option<TokenId>,

   pub participants: Vec<AccountId>,
   pub allow_duplicate_participants: bool,
   pub add_participants_start_timestamp: WrappedDuration,
   pub add_participants_end_timestamp: WrappedDuration,
   pub event_timestamp: WrappedDuration,
   pub finalized_timestamp: Option<WrappedDuration>,

   pub title: String,
   pub description: String
}

impl From<VEvent> for EventOutput {
   fn from(v_event: VEvent) -> Self {
      match v_event {
         VEvent::Current(event) => EventOutput {
            owner_account_id: event.owner_account_id,
            status: event.status,
            rewards: event.rewards.to_vec(),
            rewards_token_id: event.rewards_token_id,
            participants: event.participants.to_vec(),
            allow_duplicate_participants: event.allow_duplicate_participants,
            add_participants_start_timestamp: event.add_participants_start_timestamp,
            add_participants_end_timestamp: event.add_participants_end_timestamp,
            event_timestamp: event.event_timestamp,
            finalized_timestamp: event.finalized_timestamp,
            title: event.title,
            description: event.description,
         },
      }
   }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct EventInput {
   pub rewards: Vec<WrappedBalance>,
   pub rewards_token_id: Option<TokenId>,

   pub participants: Vec<AccountId>,
   pub allow_duplicate_participants: bool,

   pub add_participants_start_timestamp: WrappedDuration,
   pub add_participants_end_timestamp: WrappedDuration,
   pub event_timestamp: WrappedDuration,

   pub title: String,
   pub description: String
}

#[derive(BorshSerialize, BorshDeserialize, Eq, PartialEq, Debug, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum EventStatus {
   Pending,
   Calculated,
   Distributed
}

impl Giveaway {
   fn internal_get_event_output(&self, event_id: &u64) -> Option<EventOutput> {
      self.events.get(event_id).map(|event| VEvent::Current(event).into())
   }

   pub fn internal_get_event(&self, event_id: &u64) -> Event {
      self.events.get(&event_id).expect("ERR_NO_EVENT")
   }
}

#[near_bindgen]
impl Giveaway {
   pub fn get_events_to_finalize(&self, from_index: u64, limit: u64) -> HashMap<u64, Option<EventOutput>> {
      let current_timestamp = env::block_timestamp();
      (from_index..std::cmp::min(from_index + limit, self.events.len())).filter(|index| {
         let event = self.events.get(&index.clone()).unwrap();
         event.status == EventStatus::Pending && current_timestamp >= event.event_timestamp.into()
      }).map(|index| (index, self.internal_get_event_output(&index))).collect()
   }

   pub fn get_events(&self, from_index: u64, limit: u64) -> HashMap<u64, Option<EventOutput>> {
      (from_index..std::cmp::min(from_index + limit, self.events.len())).map(|index| (index, self.internal_get_event_output(&index))).collect()
   }

   pub fn get_event(&self, event_id: u64) -> Option<EventOutput> {
      self.internal_get_event_output(&event_id)
   }
}
