#!/bin/bash

# StarkRemit Deployment Script
# This script deploys the StarkRemit contracts to Starknet testnet

set -e

echo "🚀 StarkRemit Deployment Script"
echo "================================"

# Configuration
RPC_URL="https://starknet-sepolia.public.blastapi.io/rpc/v0_8"
KEYSTORE_PATH="$HOME/.starknet-accounts/starkremit-keystore.json"
ACCOUNT_PATH="$HOME/.starknet-accounts/starkremit-account.json"

# Contract artifacts
PAYMASTER_ARTIFACT="target/dev/smartcontract_PaymasterContract.contract_class.json"
ESCROW_ARTIFACT="target/dev/smartcontract_RemittanceEscrow.contract_class.json"

# Configuration values
OWNER_ADDRESS="0x0"  # Will be set after account deployment
STRK_TOKEN_ADDRESS="0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
DAILY_LIMIT="10000"
ESCROW_FEE="10"
INITIAL_FUNDING="5000"

echo "📋 Configuration:"
echo "  RPC URL: $RPC_URL"
echo "  Keystore: $KEYSTORE_PATH"
echo "  Account: $ACCOUNT_PATH"
echo "  STRK Token: $STRK_TOKEN_ADDRESS"
echo "  Daily Limit: $DAILY_LIMIT STRK"
echo "  Escrow Fee: $ESCROW_FEE STRK"
echo "  Initial Funding: $INITIAL_FUNDING STRK"
echo ""

# Check if artifacts exist
if [ ! -f "$PAYMASTER_ARTIFACT" ]; then
    echo "❌ Paymaster artifact not found: $PAYMASTER_ARTIFACT"
    echo "   Run 'scarb build' first"
    exit 1
fi

if [ ! -f "$ESCROW_ARTIFACT" ]; then
    echo "❌ Escrow artifact not found: $ESCROW_ARTIFACT"
    echo "   Run 'scarb build' first"
    exit 1
fi

echo "✅ Contract artifacts found"

# Check if keystore exists
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "❌ Keystore not found: $KEYSTORE_PATH"
    echo "   Run: starkli signer keystore new $KEYSTORE_PATH"
    exit 1
fi

echo "✅ Keystore found"

# Check if account exists
if [ ! -f "$ACCOUNT_PATH" ]; then
    echo "❌ Account not found: $ACCOUNT_PATH"
    echo "   Run: starkli account oz init $ACCOUNT_PATH --keystore $KEYSTORE_PATH"
    exit 1
fi

echo "✅ Account found"

echo ""
echo "🔍 Step 1: Declaring Contracts"
echo "================================"

# Declare PaymasterContract
echo "📝 Declaring PaymasterContract..."
PAYMASTER_CLASS_HASH=$(starkli declare "$PAYMASTER_ARTIFACT" \
    --account "$ACCOUNT_PATH" \
    --keystore "$KEYSTORE_PATH" \
    --rpc "$RPC_URL")

echo "✅ PaymasterContract declared with class hash: $PAYMASTER_CLASS_HASH"

# Declare RemittanceEscrow
echo "📝 Declaring RemittanceEscrow..."
ESCROW_CLASS_HASH=$(starkli declare "$ESCROW_ARTIFACT" \
    --account "$ACCOUNT_PATH" \
    --keystore "$KEYSTORE_PATH" \
    --rpc "$RPC_URL")

echo "✅ RemittanceEscrow declared with class hash: $ESCROW_CLASS_HASH"

echo ""
echo "🚀 Step 2: Deploying Contracts"
echo "==============================="

# Get account address
ACCOUNT_ADDRESS="0x02f5ff8a30cd75e1341acf94bb462646845e990dac75630ca5d944d65be70189"
echo "📋 Using account: $ACCOUNT_ADDRESS"

# Deploy PaymasterContract
echo "🚀 Deploying PaymasterContract..."
PAYMASTER_ADDRESS=$(starkli deploy "$PAYMASTER_CLASS_HASH" \
    --account "$ACCOUNT_PATH" \
    --keystore "$KEYSTORE_PATH" \
    --rpc "$RPC_URL" \
    "$ACCOUNT_ADDRESS" "$STRK_TOKEN_ADDRESS" "$DAILY_LIMIT")

echo "✅ PaymasterContract deployed at: $PAYMASTER_ADDRESS"

# Deploy RemittanceEscrow
echo "🚀 Deploying RemittanceEscrow..."
ESCROW_ADDRESS=$(starkli deploy "$ESCROW_CLASS_HASH" \
    --account "$ACCOUNT_PATH" \
    --keystore "$KEYSTORE_PATH" \
    --rpc "$RPC_URL" \
    "$ACCOUNT_ADDRESS" "$PAYMASTER_ADDRESS" "$STRK_TOKEN_ADDRESS" "$ESCROW_FEE")

echo "✅ RemittanceEscrow deployed at: $ESCROW_ADDRESS"

echo ""
echo "⚙️  Step 3: Initializing System"
echo "================================"

# Fund Paymaster
echo "💰 Funding Paymaster..."
starkli invoke "$PAYMASTER_ADDRESS" fund_paymaster \
    --account "$ACCOUNT_PATH" \
    --keystore "$KEYSTORE_PATH" \
    --rpc "$RPC_URL" \
    "$INITIAL_FUNDING"

echo "✅ Paymaster funded with $INITIAL_FUNDING STRK"

# Authorize Escrow
echo "🔐 Authorizing Escrow in Paymaster..."
starkli invoke "$PAYMASTER_ADDRESS" set_authorized_contract \
    --account "$ACCOUNT_PATH" \
    --keystore "$KEYSTORE_PATH" \
    --rpc "$RPC_URL" \
    "$ESCROW_ADDRESS"

echo "✅ Escrow authorized in Paymaster"

echo ""
echo "🎉 Deployment Complete!"
echo "======================="
echo "📋 Deployment Summary:"
echo "  PaymasterContract: $PAYMASTER_ADDRESS"
echo "  RemittanceEscrow: $ESCROW_ADDRESS"
echo "  Owner: $ACCOUNT_ADDRESS"
echo "  STRK Token: $STRK_TOKEN_ADDRESS"
echo ""
echo "🔍 Verify on Block Explorer:"
echo "  PaymasterContract: https://sepolia.starkscan.co/contract/$PAYMASTER_ADDRESS"
echo "  RemittanceEscrow: https://sepolia.starkscan.co/contract/$ESCROW_ADDRESS"
echo ""
echo "✅ StarkRemit system is now live on Starknet testnet!"
echo "   Users can now send gasless remittances using phone numbers."
