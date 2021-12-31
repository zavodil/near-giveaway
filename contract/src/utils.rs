use crate::*;

impl Giveaway {
   pub fn assert_whitelisted_token(&self, token_id: &Option<TokenId>) {
      if let Some (token_id_value) = token_id {
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

#[near_bindgen]
impl Giveaway {
   pub fn set_active(&mut self, active: bool){
      self.active = active;
   }

   pub fn get_next_event_id(&self) -> u64 {
      self.next_event_id
   }
}
