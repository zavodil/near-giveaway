use crate::*;

#[near_bindgen]
impl Giveaway {
   pub fn whitelist_token(&mut self, token_id: TokenId) {
      self.assert_contract_owner();

      self.whitelisted_tokens.insert(&token_id);
   }

   pub fn is_whitelisted_token(&self, token_id: &TokenId) -> bool {
      self.whitelisted_tokens.contains(token_id)
   }
}
