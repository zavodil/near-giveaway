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
