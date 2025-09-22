use starknet::{ContractAddress, contract_address_const};
use starknet::testing::{set_caller_address, set_contract_address};

fn main() {
    // Configuration - these should be set based on your deployment
    let owner = contract_address_const::<'owner'>();
    let paymaster_address = contract_address_const::<'paymaster'>();
    let token_address = contract_address_const::<'strk_token'>();
    let initial_fee = 10; // 10 STRK fee per remittance
    
    // Deploy RemittanceEscrow contract
    let contract = RemittanceEscrow::deploy(@array![owner.into(), paymaster_address.into(), token_address.into(), initial_fee.into()], @array![]).unwrap();
    let contract_address = contract.contract_address();
    
    println!("RemittanceEscrow deployed at: {}", contract_address);
    println!("Owner: {}", owner);
    println!("Paymaster address: {}", paymaster_address);
    println!("Token address: {}", token_address);
    println!("Initial fee: {} STRK", initial_fee);
    
    // Verify deployment
    let dispatcher = IRemittanceEscrowDispatcher { contract_address };
    let collected_fees = dispatcher.get_collected_fees();
    println!("Initial collected fees: {}", collected_fees);
    
    println!("Deployment successful!");
}
