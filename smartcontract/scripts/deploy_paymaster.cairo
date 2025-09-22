use starknet::{ContractAddress, contract_address_const};
use starknet::testing::{set_caller_address, set_contract_address};

fn main() {
    // Configuration
    let owner = contract_address_const::<'owner'>();
    let token_address = contract_address_const::<'strk_token'>();
    let initial_daily_limit = 10000; // 10,000 STRK daily limit
    
    // Deploy Paymaster contract
    let contract = PaymasterContract::deploy(@array![owner.into(), token_address.into(), initial_daily_limit.into()], @array![]).unwrap();
    let contract_address = contract.contract_address();
    
    println!("Paymaster deployed at: {}", contract_address);
    println!("Owner: {}", owner);
    println!("Token address: {}", token_address);
    println!("Initial daily limit: {}", initial_daily_limit);
    
    // Optional: Fund the paymaster with initial amount
    let initial_funding = 5000; // 5,000 STRK initial funding
    set_caller_address(owner);
    
    let dispatcher = IPaymasterDispatcher { contract_address };
    let fund_success = dispatcher.fund_paymaster(initial_funding);
    
    if fund_success {
        println!("Initial funding successful: {} STRK", initial_funding);
        println!("Available balance: {}", dispatcher.get_available_balance());
    } else {
        println!("Initial funding failed");
    }
}
