use crate::*;

impl Giveaway {
   pub fn internal_add_service_fee(&mut self, token_id: &Option<TokenId>, fee: &Balance) {
      let balance = self.total_service_fee.get(token_id).unwrap_or_default();
      self.total_service_fee.insert(token_id, &(balance + fee));
   }

   pub fn assert_whitelisted_token(&self, token_id: &Option<TokenId>) {
      if let Some(token_id_value) = token_id {
         assert!(self.is_whitelisted_token(token_id_value), "ERR_TOKEN_NOT_ALLOWED");
      }
   }

   pub fn assert_event_owner(&self, event: &Event) {
      assert_eq!(env::predecessor_account_id(), event.owner_account_id, "ERR_NO_ACCESS");
   }

   pub fn assert_contract_owner(&self) {
      assert_eq!(env::predecessor_account_id(), self.owner_id, "ERR_NO_ACCESS");
   }

   pub fn assert_active(&self) {
      assert!(self.active, "ERR_CONTRACT_DISABLED");
   }
}

pub fn get_service_fee(total: &Balance) -> Balance{
   std::cmp::min(MAX_SERVICE_FEE, total * SERVICE_FEE_NUMERATOR as Balance / SERVICE_FEE_DENOMINATOR as Balance)
}

#[near_bindgen]
impl Giveaway {
   pub fn set_active(&mut self, active: bool) {
      self.active = active;
   }

   pub fn get_next_event_id(&self) -> u64 {
      self.next_event_id
   }

   pub fn get_total_service_fee(&self, token_id: Option<TokenId>) -> Option<Balance> {
      self.total_service_fee.get(&token_id)
   }

   pub fn get_service_fee_percent(&self) -> f64{
      SERVICE_FEE_NUMERATOR as f64 / SERVICE_FEE_DENOMINATOR as f64
   }

}
