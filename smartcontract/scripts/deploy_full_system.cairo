use starknet::{ContractAddress, contract_address_const};
use starknet::testing::{set_caller_address, set_contract_address};

fn main() {
    // Configuration
    let owner = contract_address_const::<'owner'>();
    let token_address = contract_address_const::<'strk_token'>();
    let initial_daily_limit = 10000; // 10,000 STRK daily limit
    let initial_fee = 10; // 10 STRK fee per remittance
    let initial_funding = 5000; // 5,000 STRK initial funding
    
    println!("=== StarkRemit System Deployment ===");
    println!("Owner: {}", owner);
    println!("Token address: {}", token_address);
    println!("Initial daily limit: {} STRK", initial_daily_limit);
    println!("Initial fee: {} STRK", initial_fee);
    println!("Initial funding: {} STRK", initial_funding);
    println!();
    
    // Step 1: Deploy Paymaster contract
    println!("Step 1: Deploying Paymaster contract...");
    let paymaster_contract = PaymasterContract::deploy(@array![owner.into(), token_address.into(), initial_daily_limit.into()], @array![]).unwrap();
    let paymaster_address = paymaster_contract.contract_address();
    println!("✅ Paymaster deployed at: {}", paymaster_address);
    
    // Step 2: Fund the paymaster
    println!("Step 2: Funding Paymaster...");
    set_caller_address(owner);
    let paymaster_dispatcher = IPaymasterDispatcher { contract_address: paymaster_address };
    let fund_success = paymaster_dispatcher.fund_paymaster(initial_funding);
    
    if fund_success {
        println!("✅ Paymaster funded with {} STRK", initial_funding);
        println!("   Available balance: {} STRK", paymaster_dispatcher.get_available_balance());
    } else {
        println!("❌ Paymaster funding failed");
        return;
    }
    
    // Step 3: Deploy RemittanceEscrow contract
    println!("Step 3: Deploying RemittanceEscrow contract...");
    let escrow_contract = RemittanceEscrow::deploy(@array![owner.into(), paymaster_address.into(), token_address.into(), initial_fee.into()], @array![]).unwrap();
    let escrow_address = escrow_contract.contract_address();
    println!("✅ RemittanceEscrow deployed at: {}", escrow_address);
    
    // Step 4: Authorize the escrow contract in the paymaster
    println!("Step 4: Authorizing RemittanceEscrow in Paymaster...");
    paymaster_dispatcher.set_authorized_contract(escrow_address);
    println!("✅ RemittanceEscrow authorized in Paymaster");
    
    // Step 5: Verify system setup
    println!("Step 5: Verifying system setup...");
    let escrow_dispatcher = IRemittanceEscrowDispatcher { contract_address: escrow_address };
    
    // Check paymaster status
    let paymaster_balance = paymaster_dispatcher.get_available_balance();
    let paymaster_daily_limit = paymaster_dispatcher.get_daily_limit();
    let paymaster_total_sponsored = paymaster_dispatcher.get_total_sponsored();
    
    // Check escrow status
    let escrow_fees = escrow_dispatcher.get_collected_fees();
    
    println!("✅ System verification complete:");
    println!("   Paymaster balance: {} STRK", paymaster_balance);
    println!("   Paymaster daily limit: {} STRK", paymaster_daily_limit);
    println!("   Paymaster total sponsored: {} STRK", paymaster_total_sponsored);
    println!("   Escrow collected fees: {} STRK", escrow_fees);
    
    println!();
    println!("=== Deployment Summary ===");
    println!("Paymaster Contract: {}", paymaster_address);
    println!("RemittanceEscrow Contract: {}", escrow_address);
    println!("Owner: {}", owner);
    println!("Token: {}", token_address);
    println!();
    println!("🎉 StarkRemit system deployed successfully!");
    println!("   Users can now send gasless remittances using phone numbers.");
    println!("   The system is ready to process remittance transactions.");
}
