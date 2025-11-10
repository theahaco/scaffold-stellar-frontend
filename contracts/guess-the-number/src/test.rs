#![cfg(test)]
// This lets use reference types in the std library for testing
extern crate std;

use super::*;
use soroban_sdk::{
    testutils::{Address as _, MockAuth, MockAuthInvoke},
    Address, Env, IntoVal, Val, Vec,
};

fn init_test<'a>(env: &'a Env) -> (Address, GuessTheNumberClient<'a>) {
    let admin = Address::generate(env);
    let client = generate_client(env, &admin);
    (admin, client)
}

#[test]
fn constructed_correctly() {
    let env = &Env::default();
    let (admin, client) = init_test(env);
    // Check that the admin is set correctly
    assert_eq!(client.admin(), Some(admin.clone()));
}

#[test]
fn only_admin_can_reset() {
    let env = &Env::default();
    let (admin, client) = init_test(env);
    let user = Address::generate(env);

    set_caller(&client, "reset", &user, ());
    assert!(client.try_reset().is_err());

    set_caller(&client, "reset", &admin, ());
    assert!(client.try_reset().is_ok());
}

#[test]
fn guess() {
    let env = &Env::default();
    let (_, client) = init_test(env);
    // This lets you mock all auth when they become complicated when making cross contract calls.
    env.mock_all_auths();

    // Set the number
    client.reset();

    // In the testing enviroment the random seed is always the same initially.
    // This tests a wrong guess:
    assert!(!client.guess(&3));
    // Now we test a correct guess:
    assert!(client.guess(&4));
}

fn generate_client<'a>(env: &Env, admin: &Address) -> GuessTheNumberClient<'a> {
    let contract_id = Address::generate(env);
    env.mock_all_auths();
    let contract_id = env.register_at(&contract_id, GuessTheNumber, (admin,));
    env.set_auths(&[]); // clear auths
    GuessTheNumberClient::new(env, &contract_id)
}

// This lets you mock the auth context for a function call
fn set_caller<T>(client: &GuessTheNumberClient, fn_name: &str, caller: &Address, args: T)
where
    T: IntoVal<Env, Vec<Val>>,
{
    // clear previous auth mocks
    client.env.set_auths(&[]);

    let invoke = &MockAuthInvoke {
        contract: &client.address,
        fn_name,
        args: args.into_val(&client.env),
        sub_invokes: &[],
    };

    // mock auth as passed-in address
    client.env.mock_auths(&[MockAuth {
        address: &caller,
        invoke,
    }]);
}
