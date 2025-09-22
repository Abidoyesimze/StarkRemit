// Deployment configuration for StarkRemit system
// Update these values based on your deployment environment

#[derive(Drop, Serde, starknet::Store)]
struct DeploymentConfig {
    // Contract owner (admin address)
    owner: ContractAddress,
    
    // STRK token contract address on Starknet
    strk_token_address: ContractAddress,
    
    // Paymaster configuration
    paymaster_daily_limit: u256, // Daily sponsorship limit in STRK
    paymaster_initial_funding: u256, // Initial funding amount in STRK
    paymaster_gas_multiplier: u256, // Gas price multiplier (150 = 1.5x)
    
    // RemittanceEscrow configuration
    escrow_fee: u256, // Fee per remittance in STRK
    escrow_expiry_days: u64, // Remittance expiry in days (default: 90)
}

// Default configuration for testnet
fn get_testnet_config() -> DeploymentConfig {
    DeploymentConfig {
        owner: contract_address_const::<'testnet_owner'>(),
        strk_token_address: contract_address_const::<'strk_testnet'>(),
        paymaster_daily_limit: 10000, // 10,000 STRK
        paymaster_initial_funding: 5000, // 5,000 STRK
        paymaster_gas_multiplier: 150, // 1.5x multiplier
        escrow_fee: 10, // 10 STRK fee
        escrow_expiry_days: 90, // 90 days
    }
}

// Default configuration for mainnet
fn get_mainnet_config() -> DeploymentConfig {
    DeploymentConfig {
        owner: contract_address_const::<'mainnet_owner'>(),
        strk_token_address: contract_address_const::<'strk_mainnet'>(),
        paymaster_daily_limit: 100000, // 100,000 STRK
        paymaster_initial_funding: 50000, // 50,000 STRK
        paymaster_gas_multiplier: 150, // 1.5x multiplier
        escrow_fee: 10, // 10 STRK fee
        escrow_expiry_days: 90, // 90 days
    }
}

// Configuration for local development
fn get_local_config() -> DeploymentConfig {
    DeploymentConfig {
        owner: contract_address_const::<'local_owner'>(),
        strk_token_address: contract_address_const::<'strk_local'>(),
        paymaster_daily_limit: 1000, // 1,000 STRK
        paymaster_initial_funding: 500, // 500 STRK
        paymaster_gas_multiplier: 150, // 1.5x multiplier
        escrow_fee: 1, // 1 STRK fee
        escrow_expiry_days: 7, // 7 days for testing
    }
}
