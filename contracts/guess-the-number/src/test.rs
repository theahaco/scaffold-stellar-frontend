#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{
    testutils::{Address as _, MockAuth, MockAuthInvoke},
    Address, Env, IntoVal, Val, Vec,
};

#[test]
fn only_admin_can_reset() {
    let env = &Env::default();

    let admin = Address::generate(env);
    let user = Address::generate(env);

    let client = generate_client(env, &admin);

    set_caller(&client, "reset", &user, ());
    assert!(client.try_reset().is_err());

    set_caller(&client, "reset", &admin, ());
    assert!(client.try_reset().is_ok());
}

#[test]
fn one_guess_in_ten_returns_true() {
    let env = &Env::default();

    let admin = Address::generate(env);

    let client = generate_client(env, &admin);

    // set the number
    set_caller(&client, "reset", &admin, ());
    client.reset();

    let trues: std::vec::Vec<_> = (1u64..=10).filter(|number| client.guess(number)).collect();
    assert_eq!(trues.len(), 1);
}

fn generate_client<'a>(env: &Env, admin: &Address) -> GuessTheNumberClient<'a> {
    let contract_id = env.register(GuessTheNumber, (admin,));
    GuessTheNumberClient::new(env, &contract_id)
}

fn set_caller<T>(client: &GuessTheNumberClient, method: &str, caller: &Address, args: T)
where
    T: IntoVal<Env, Vec<Val>>,
{
    // clear previous auth mocks
    client.env.set_auths(&[]);

    // mock auth as passed-in address
    client.env.mock_auths(&[MockAuth {
        address: caller,
        invoke: &MockAuthInvoke {
            contract: &client.address,
            fn_name: method,
            args: args.into_val(&client.env),
            sub_invokes: &[],
        },
    }]);
}
