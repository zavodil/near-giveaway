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
   Complete,
}

impl Giveaway {
   pub fn internal_get_payouts(&self, event_id: &u64) -> Vec<Payout> {
      self.payouts.get(&event_id).unwrap_or_else(|| [].to_vec())
   }
}

#[near_bindgen]
impl Giveaway {
   pub fn get_payouts(&self, event_id: u64, from_index: Option<u64>, limit: Option<u64>) -> Vec<Payout> {
      let payouts = self.internal_get_payouts(&event_id);
      if from_index.is_none() && limit.is_none(){
         return payouts;
      }
      let from_index = from_index.unwrap_or(0);
      let limit = limit.unwrap_or(payouts.len() as u64);

      (from_index..from_index + limit)
         .map(|index| payouts.get(index as usize).unwrap().to_owned())
         .collect()
   }
}
