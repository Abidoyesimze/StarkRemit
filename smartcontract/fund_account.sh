#!/bin/bash

# StarkRemit Account Funding Helper
# This script helps fund the Starknet account for deployment

set -e

echo "💰 StarkRemit Account Funding Helper"
echo "===================================="

ACCOUNT_ADDRESS="0x02f5ff8a30cd75e1341acf94bb462646845e990dac75630ca5d944d65be70189"

echo "📋 Account Information:"
echo "  Address: $ACCOUNT_ADDRESS"
echo ""

echo "🎯 Funding Options:"
echo "1. Starknet Faucet: https://faucet.starknet.io/"
echo "2. Alchemy Faucet: https://starknet-faucet.vercel.app/"
echo "3. QuickNode Faucet: https://faucet.quicknode.com/starknet/sepolia"
echo ""

echo "📝 Instructions:"
echo "1. Visit one of the faucet URLs above"
echo "2. Enter your account address: $ACCOUNT_ADDRESS"
echo "3. Request testnet ETH (usually 0.1-0.5 ETH)"
echo "4. Wait for the transaction to be confirmed"
echo "5. Run './deploy.sh' to deploy the contracts"
echo ""

echo "🔍 Check Account Balance:"
echo "You can check your account balance at:"
echo "https://sepolia.starkscan.co/account/$ACCOUNT_ADDRESS"
echo ""

echo "⚠️  Note:"
echo "You need at least 0.01 ETH to deploy contracts"
echo "Recommended: 0.1 ETH for smooth deployment"
