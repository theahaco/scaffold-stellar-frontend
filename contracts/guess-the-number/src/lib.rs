#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, BytesN, Env, Symbol};

#[contract]
pub struct GuessTheNumber;

const THE_NUMBER: Symbol = symbol_short!("n");
pub const ADMIN_KEY: &Symbol = &symbol_short!("ADMIN");

#[contractimpl]
impl GuessTheNumber {
    pub fn __constructor(env: &Env, admin: Address) {
        Self::set_admin(env, &admin);
    }

    /// Update the number. Only callable by admin.
    pub fn reset(env: &Env) {
        Self::require_admin(env);
        let new_number: u64 = env.prng().gen_range(1..=10);
        env.storage().instance().set(&THE_NUMBER, &new_number);
    }

    /// Guess a number between 1 and 10
    pub fn guess(env: &Env, a_number: u64) -> bool {
        a_number == env.storage().instance().get::<_, u64>(&THE_NUMBER).unwrap()
    }

    /// Upgrade the contract to new wasm. Only callable by admin.
    pub fn upgrade(env: &Env, new_wasm_hash: BytesN<32>) {
        Self::require_admin(env);
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }

    fn admin(env: &Env) -> Option<Address> {
        env.storage().instance().get(ADMIN_KEY)
    }

    fn set_admin(env: &Env, admin: &Address) {
        // Check if admin is already set
        if env.storage().instance().has(ADMIN_KEY) {
            panic!("admin already set");
        }
        env.storage().instance().set(ADMIN_KEY, admin);
    }

    fn require_admin(env: &Env) {
        let admin = Self::admin(env).expect("admin not set");
        admin.require_auth();
    }
}

mod test;
