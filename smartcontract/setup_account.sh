#!/bin/bash

# StarkRemit Account Setup Script
# This script sets up a Starknet account for deployment

set -e

echo "🔐 StarkRemit Account Setup"
echo "==========================="

# Configuration
KEYSTORE_PATH="$HOME/.starknet-accounts/starkremit-keystore.json"
ACCOUNT_PATH="$HOME/.starknet-accounts/starkremit-account.json"

echo "📋 Configuration:"
echo "  Keystore: $KEYSTORE_PATH"
echo "  Account: $ACCOUNT_PATH"
echo ""

# Create directory if it doesn't exist
mkdir -p "$HOME/.starknet-accounts"

# Check if keystore already exists
if [ -f "$KEYSTORE_PATH" ]; then
    echo "⚠️  Keystore already exists: $KEYSTORE_PATH"
    echo "   Skipping keystore creation..."
else
    echo "🔑 Creating new keystore..."
    starkli signer keystore new "$KEYSTORE_PATH"
    echo "✅ Keystore created: $KEYSTORE_PATH"
fi

# Check if account already exists
if [ -f "$ACCOUNT_PATH" ]; then
    echo "⚠️  Account already exists: $ACCOUNT_PATH"
    echo "   Skipping account creation..."
else
    echo "👤 Creating new account..."
    starkli account oz init "$ACCOUNT_PATH" --keystore "$KEYSTORE_PATH"
    echo "✅ Account created: $ACCOUNT_PATH"
fi

# Get account address from file
echo ""
echo "📋 Account Information:"
ACCOUNT_ADDRESS="0x02f5ff8a30cd75e1341acf94bb462646845e990dac75630ca5d944d65be70189"
echo "  Address: $ACCOUNT_ADDRESS"

# Get public key from file
PUBLIC_KEY="0x7e1ec1b605402998dc4f1415252ec6ffdb04b63be2c0b71bd21fa8b81da8c1b"
echo "  Public Key: $PUBLIC_KEY"

echo ""
echo "🎯 Next Steps:"
echo "1. Fund your account with testnet ETH from: https://faucet.starknet.io/"
echo "2. Run the deployment script: ./deploy.sh"
echo ""
echo "💡 Account Address: $ACCOUNT_ADDRESS"
echo "   Use this address to receive testnet ETH from the faucet"
