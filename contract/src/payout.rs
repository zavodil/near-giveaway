use crate::*;

pub type PayoutIndex = u64;

/// Payout information
#[derive(BorshSerialize, BorshDeserialize)]
pub enum VPayout {
   Current(Payout)
}

#[derive(Debug, Clone, BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Payout {
   pub account_id: AccountId,
   pub amount: WrappedBalance,
   pub token_id: Option<TokenId>,
   pub status: PayoutStatus
}

impl From<VPayout> for Payout {
   fn from(v_payout: VPayout) -> Self {
      match v_payout {
         VPayout::Current(payout) => payout,
      }
   }
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Eq, PartialEq, Debug, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub enum PayoutStatus {
   Pending,
   Complete
}

#[near_bindgen]
impl Giveaway {
   pub fn get_payouts(&self, event_id: u64, from_index: u64, limit: u64) -> Vec<(PayoutIndex, Option<Payout>)> {
      (from_index..std::cmp::min(from_index + limit, self.events.len())).map(|index| {
         (index, self.payouts.get(&(event_id, index)))
      }).collect()
   }
}
