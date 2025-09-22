# StarkRemit Deployment Guide

## Prerequisites

1. **Compiled Contracts**: Ensure contracts are compiled with `scarb build`
2. **Account Setup**: You need a Starknet account with testnet ETH
3. **Network Access**: Access to Starknet testnet RPC

## Contract Artifacts

Our contracts are compiled and ready for deployment:

- **PaymasterContract**: `target/dev/smartcontract_PaymasterContract.contract_class.json`
- **RemittanceEscrow**: `target/dev/smartcontract_RemittanceEscrow.contract_class.json`

## Deployment Steps

### Step 1: Account Setup

1. **Create Keystore**:
   ```bash
   starkli signer keystore new ~/.starknet-accounts/starkremit-keystore.json
   ```

2. **Create Account**:
   ```bash
   starkli account oz init ~/.starknet-accounts/starkremit-account.json \
     --keystore ~/.starknet-accounts/starkremit-keystore.json
   ```

3. **Deploy Account** (requires testnet ETH):
   ```bash
   starkli account deploy ~/.starknet-accounts/starkremit-account.json
   ```

### Step 2: Declare Contracts

1. **Declare PaymasterContract**:
   ```bash
   starkli declare target/dev/smartcontract_PaymasterContract.contract_class.json \
     --account ~/.starknet-accounts/starkremit-account.json \
     --keystore ~/.starknet-accounts/starkremit-keystore.json \
     --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_8
   ```

2. **Declare RemittanceEscrow**:
   ```bash
   starkli declare target/dev/smartcontract_RemittanceEscrow.contract_class.json \
     --account ~/.starknet-accounts/starkremit-account.json \
     --keystore ~/.starknet-accounts/starkremit-keystore.json \
     --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_8
   ```

### Step 3: Deploy Contracts

1. **Deploy PaymasterContract**:
   ```bash
   starkli deploy <PAYMASTER_CLASS_HASH> \
     --account ~/.starknet-accounts/starkremit-account.json \
     --keystore ~/.starknet-accounts/starkremit-keystore.json \
     --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_8 \
     --inputs <OWNER_ADDRESS> <STRK_TOKEN_ADDRESS> 10000
   ```

2. **Deploy RemittanceEscrow**:
   ```bash
   starkli deploy <ESCROW_CLASS_HASH> \
     --account ~/.starknet-accounts/starkremit-account.json \
     --keystore ~/.starknet-accounts/starkremit-keystore.json \
     --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_8 \
     --inputs <OWNER_ADDRESS> <PAYMASTER_ADDRESS> <STRK_TOKEN_ADDRESS> 10
   ```

### Step 4: Initialize System

1. **Fund Paymaster**:
   ```bash
   starkli invoke <PAYMASTER_ADDRESS> fund_paymaster \
     --account ~/.starknet-accounts/starkremit-account.json \
     --keystore ~/.starknet-accounts/starkremit-keystore.json \
     --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_8 \
     --inputs 5000
   ```

2. **Authorize Escrow**:
   ```bash
   starkli invoke <PAYMASTER_ADDRESS> set_authorized_contract \
     --account ~/.starknet-accounts/starkremit-account.json \
     --keystore ~/.starknet-accounts/starkremit-keystore.json \
     --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_8 \
     --inputs <ESCROW_ADDRESS>
   ```

## Configuration Values

### Testnet Configuration
- **STRK Token**: `0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d`
- **Daily Limit**: `10000` (10,000 STRK)
- **Initial Funding**: `5000` (5,000 STRK)
- **Escrow Fee**: `10` (10 STRK)

### Contract Addresses
After deployment, you'll get contract addresses that you can use for:
- Contract interactions
- Block explorer verification
- Integration testing

## Verification

1. **Check on Block Explorer**: 
   - Sepolia: https://sepolia.starkscan.co/
   - Enter your contract addresses

2. **Test Functionality**:
   - Send a test remittance
   - Claim a remittance
   - Check gas sponsorship

## Troubleshooting

1. **Insufficient Funds**: Get testnet ETH from Starknet faucet
2. **RPC Issues**: Try different RPC endpoints
3. **Account Issues**: Recreate keystore and account
4. **Contract Issues**: Verify compilation and artifacts

## Next Steps

After successful deployment:
1. Update configuration with deployed addresses
2. Test all contract functionality
3. Prepare for mainnet deployment
4. Set up monitoring and alerts
