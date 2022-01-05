use near_sdk::PromiseResult;

use crate::*;

#[ext_contract(ext_multisender)]
pub trait ExtMultisender {
   fn multisend_attached_tokens(&self, accounts: Vec<MultisenderPayout>);
}

#[derive(Debug, Clone, BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct MultisenderPayout {
   pub account_id: AccountId,
   pub token_id: Option<TokenId>,
   pub amount: WrappedBalance,
}

#[near_bindgen]
impl Giveaway {
   #[private]
   pub fn after_multisend_attached_tokens(&mut self, event_id: u64, accounts: Vec<MultisenderPayout>) -> bool {
      let promise_success = is_promise_success();
      if !promise_success {
         let mut payouts = self.internal_get_payouts(&event_id);
         for account in accounts {
            payouts = payouts.into_iter().map(|mut payout| {
               if payout.account_id == account.account_id && payout.amount == account.amount {
                  payout.status = PayoutStatus::Pending;
               }
               payout
            }).collect()
         }
         self.payouts.insert(&event_id, &payouts);
      }

      promise_success
   }
}

fn is_promise_success() -> bool {
   assert_eq!(
      env::promise_results_count(),
      1,
      "Contract expected a result on the callback"
   );
   match env::promise_result(0) {
      PromiseResult::Successful(_) => true,
      _ => false,
   }
}
