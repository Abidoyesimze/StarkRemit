# StarkRemit User Guide

Welcome to StarkRemit! This guide will help you understand how to use the gasless remittance system on Starknet.

## What is StarkRemit?

StarkRemit is a revolutionary system that allows you to send money to phone numbers without paying gas fees. It's built on Starknet and uses a sophisticated paymaster mechanism to sponsor gas fees, making remittances accessible to everyone.

## How It Works

1. **Send Remittance**: You send STRK tokens to a phone number hash
2. **Gas Sponsorship**: The paymaster contract sponsors gas fees for claims
3. **Claim Remittance**: Recipients can claim their money gaslessly
4. **Automatic Refunds**: Unclaimed remittances are automatically refunded after 90 days

## Getting Started

### Prerequisites

- A Starknet wallet (e.g., Argent, Braavos)
- STRK tokens for remittances and fees
- Phone number of the recipient

### Step 1: Connect Your Wallet

1. Open your Starknet wallet
2. Connect to the StarkRemit dApp
3. Ensure you have sufficient STRK balance

### Step 2: Send a Remittance

1. Enter the recipient's phone number
2. Enter the amount you want to send
3. Review the fee (typically 10 STRK)
4. Confirm the transaction

**Example:**
- Phone: +1234567890
- Amount: 100 STRK
- Fee: 10 STRK
- Net amount received: 90 STRK

### Step 3: Recipient Claims Remittance

The recipient can claim their remittance in two ways:

#### Option A: Gasless Claim (Recommended)
1. Recipient connects their wallet
2. Enters their phone number
3. Clicks "Claim Gaslessly"
4. Receives the remittance without paying gas

#### Option B: Manual Claim
1. Recipient connects their wallet
2. Enters their phone number
3. Clicks "Claim Manually"
4. Pays gas fees and receives the remittance

## Understanding Fees

### Remittance Fee
- Fixed fee per remittance (default: 10 STRK)
- Covers system maintenance and sustainability
- Deducted from the total amount sent

### Gas Fees
- **Gasless Claims**: Sponsored by the paymaster
- **Manual Claims**: Paid by the recipient
- **Sending**: Paid by the sender

## Phone Number Hashing

StarkRemit uses phone number hashing for privacy and security:

- Phone numbers are hashed before storage
- Original phone numbers are never stored
- Only the hash is used for transactions
- Recipients must know their phone number to claim

## Daily Limits

The system has daily limits to prevent abuse:

- **Paymaster Daily Limit**: Maximum STRK sponsored per day
- **Individual Limits**: May be implemented per user
- **System Limits**: Overall system capacity limits

## Expiry and Refunds

### Automatic Expiry
- Remittances expire after 90 days
- Unclaimed remittances are automatically refunded
- Refunds go back to the original sender

### Manual Refunds
- Senders can request refunds for expired remittances
- Refunds are processed automatically
- No additional fees for refunds

## Security Features

### Pause Mechanism
- System can be paused in emergencies
- Prevents new remittances during pause
- Existing remittances remain claimable

### Amount Limits
- Minimum remittance: 1 STRK
- Maximum remittance: 1,000,000 STRK
- Limits can be adjusted by administrators

### Input Validation
- Comprehensive validation of all inputs
- Protection against invalid data
- Error messages for guidance

## Troubleshooting

### Common Issues

#### "Insufficient Balance"
- **Cause**: Not enough STRK tokens
- **Solution**: Add more STRK to your wallet

#### "Amount Too Small"
- **Cause**: Amount below minimum limit
- **Solution**: Increase the amount to at least 1 STRK

#### "Phone Has Pending Remittance"
- **Cause**: Phone number already has unclaimed remittance
- **Solution**: Wait for current remittance to be claimed or expired

#### "Gasless Claim Failed"
- **Cause**: Paymaster cannot sponsor gas
- **Solution**: Use manual claim instead

#### "Remittance Not Found"
- **Cause**: No remittance exists for phone number
- **Solution**: Verify phone number and check if remittance was sent

### Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Contract is paused" | System temporarily disabled | Wait for system to resume |
| "Amount must be greater than fee" | Insufficient amount for fee | Increase amount |
| "Invalid phone hash" | Phone number validation failed | Check phone number format |
| "Already claimed" | Remittance already claimed | Check transaction history |
| "Not expired yet" | Remittance not yet expired | Wait for expiry date |

## Best Practices

### For Senders

1. **Verify Phone Numbers**: Double-check recipient phone numbers
2. **Check Fees**: Understand the fee structure before sending
3. **Monitor Status**: Track your sent remittances
4. **Keep Records**: Save transaction hashes for reference
5. **Test Small Amounts**: Start with small amounts for new recipients

### For Recipients

1. **Claim Promptly**: Claim remittances as soon as possible
2. **Use Gasless Claims**: Prefer gasless claims when available
3. **Verify Amount**: Check the amount before claiming
4. **Keep Phone Number**: Remember your phone number for claims
5. **Monitor Expiry**: Be aware of expiry dates

### General Tips

1. **Network Conditions**: Consider network congestion
2. **Wallet Security**: Keep your wallet secure
3. **Backup Recovery**: Backup your wallet recovery phrase
4. **Stay Updated**: Follow system updates and announcements
5. **Community Support**: Join the community for help

## Advanced Features

### Batch Operations
- Send multiple remittances in one transaction
- Reduce overall gas costs
- Improve efficiency

### Monitoring Dashboard
- Track all your remittances
- Monitor system status
- View transaction history

### API Integration
- Integrate with existing systems
- Automate remittance processes
- Customize user experience

## Support and Resources

### Getting Help

1. **Documentation**: Check this guide and API docs
2. **Community**: Join Discord/Telegram for support
3. **GitHub**: Report issues and feature requests
4. **Email**: Contact support team directly

### Useful Links

- [Main Documentation](../README.md)
- [API Reference](API.md)
- [Security Audit](../smartcontract/SECURITY_AUDIT.md)
- [Deployment Guide](../smartcontract/DEPLOYMENT.md)

### Community

- **Discord**: Join our Discord server
- **Telegram**: Follow our Telegram channel
- **Twitter**: Follow us on Twitter
- **GitHub**: Star our repository

## Frequently Asked Questions

### Q: How much does it cost to send a remittance?
A: The fee is typically 10 STRK per remittance, regardless of amount.

### Q: Can I send remittances to any phone number?
A: Yes, as long as the phone number is valid and not already in use.

### Q: What happens if the recipient doesn't claim the remittance?
A: The remittance will be automatically refunded after 90 days.

### Q: Can I cancel a remittance after sending?
A: No, remittances cannot be cancelled once sent.

### Q: Is there a limit on how much I can send?
A: Yes, there are minimum (1 STRK) and maximum (1M STRK) limits.

### Q: How long does it take to process a remittance?
A: Remittances are processed immediately on the blockchain.

### Q: Can I send remittances to international phone numbers?
A: Yes, any valid phone number format is supported.

### Q: What if the paymaster runs out of funds?
A: Recipients can still claim using manual claims (paying gas themselves).

## Conclusion

StarkRemit makes sending money to phone numbers simple, secure, and gasless. By following this guide and best practices, you can make the most of this revolutionary remittance system.

For additional support or questions, please refer to the resources listed above or contact our support team.

---

**Happy Remitting!** 🚀
