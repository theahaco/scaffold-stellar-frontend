#![no_std]
use admin_sep::{Administratable, Upgradable};
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Symbol};

#[contract]
pub struct GuessTheNumber;

#[contractimpl]
impl Administratable for GuessTheNumber {}

#[contractimpl]
impl Upgradable for GuessTheNumber {}

const THE_NUMBER: Symbol = symbol_short!("n");

#[contractimpl]
impl GuessTheNumber {
    pub fn __constructor(env: &Env, admin: &Address) {
        Self::set_admin(env, admin);
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
}

mod test;
