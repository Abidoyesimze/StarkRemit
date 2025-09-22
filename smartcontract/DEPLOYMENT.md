# StarkRemit Deployment Guide

This guide explains how to deploy the StarkRemit gasless remittance system on Starknet.

## Prerequisites

1. **Starknet Foundry** installed
2. **STRK tokens** for deployment and initial funding
3. **Valid Starknet account** with sufficient balance

## System Overview

StarkRemit consists of two main contracts:

1. **Paymaster Contract** - Sponsors gas fees for authorized contracts
2. **RemittanceEscrow Contract** - Handles remittance transactions with phone number hashing

## Deployment Steps

### 1. Configure Deployment Parameters

Edit `config/deployment_config.cairo` to set your deployment parameters:

```cairo
// Update these addresses for your deployment
owner: contract_address_const::<'your_address'>(),
strk_token_address: contract_address_const::<'strk_token_address'>(),
```

### 2. Deploy Individual Contracts

#### Deploy Paymaster Only
```bash
starknet deploy --contract target/dev/smartcontract_PaymasterContract.contract_class.json --inputs <owner> <strk_token_address> <daily_limit>
```

#### Deploy RemittanceEscrow Only
```bash
starknet deploy --contract target/dev/smartcontract_RemittanceEscrow.contract_class.json --inputs <owner> <paymaster_address> <strk_token_address> <fee>
```

### 3. Deploy Full System (Recommended)

Use the comprehensive deployment script:

```bash
# Build the contracts first
scarb build

# Run the full deployment script
starknet run scripts/deploy_full_system.cairo
```

This script will:
1. Deploy the Paymaster contract
2. Fund it with initial STRK tokens
3. Deploy the RemittanceEscrow contract
4. Authorize the escrow contract in the paymaster
5. Verify the system setup

### 4. Post-Deployment Setup

After deployment, you may need to:

1. **Update daily limits** based on usage patterns
2. **Monitor paymaster balance** and refill as needed
3. **Set up monitoring** for system health
4. **Configure fee structure** based on market conditions

## Configuration Parameters

### Paymaster Configuration
- `daily_limit`: Maximum STRK that can be sponsored per day
- `initial_funding`: Initial STRK amount to fund the paymaster
- `gas_multiplier`: Safety multiplier for gas estimation (default: 1.5x)

### RemittanceEscrow Configuration
- `fee`: STRK fee charged per remittance transaction
- `expiry_days`: Number of days before unclaimed remittances expire

## Environment-Specific Configurations

### Testnet
- Lower daily limits for testing
- Smaller initial funding
- Shorter expiry periods

### Mainnet
- Higher daily limits for production
- Larger initial funding
- Standard expiry periods

## Security Considerations

1. **Owner Key Management**: Secure the owner private key
2. **Paymaster Balance**: Monitor and maintain adequate balance
3. **Daily Limits**: Set appropriate limits to prevent abuse
4. **Contract Authorization**: Only authorize trusted contracts

## Monitoring

Monitor these key metrics:
- Paymaster balance and daily usage
- Remittance transaction volume
- Failed gasless claims (fallback to manual)
- Expired remittances requiring refunds

## Troubleshooting

### Common Issues

1. **Insufficient Paymaster Balance**
   - Fund the paymaster with more STRK tokens
   - Check daily limit settings

2. **Authorization Errors**
   - Ensure RemittanceEscrow is authorized in Paymaster
   - Verify contract addresses are correct

3. **Gas Estimation Failures**
   - Check gas multiplier settings
   - Verify network conditions

## Support

For deployment issues or questions:
1. Check the test files for usage examples
2. Review the contract documentation
3. Verify all configuration parameters
