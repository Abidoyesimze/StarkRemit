# StarkRemit API Reference

This document provides a comprehensive API reference for the StarkRemit smart contracts.

## Paymaster Contract API

### Core Functions

#### `sponsor_claim(claimer: ContractAddress, gas_estimate: u256) -> bool`
Sponsors gas fees for a transaction from an authorized contract.

**Parameters:**
- `claimer`: Address of the user claiming the sponsorship
- `gas_estimate`: Estimated gas cost for the transaction

**Returns:**
- `bool`: True if sponsorship was successful

**Requirements:**
- Contract must be authorized
- Sufficient balance available
- Within daily limits
- Contract not paused

#### `check_can_sponsor(gas_estimate: u256) -> bool`
Checks if the paymaster can sponsor a transaction with the given gas estimate.

**Parameters:**
- `gas_estimate`: Gas estimate to check

**Returns:**
- `bool`: True if sponsorship is possible

#### `fund_paymaster(amount: u256) -> bool`
Funds the paymaster with STRK tokens.

**Parameters:**
- `amount`: Amount of STRK tokens to fund

**Returns:**
- `bool`: True if funding was successful

**Requirements:**
- Caller must have sufficient STRK balance
- Caller must have approved this contract

### Administrative Functions

#### `emergency_withdraw(amount: u256)`
Withdraws STRK tokens from the paymaster (owner only).

**Parameters:**
- `amount`: Amount to withdraw

**Requirements:**
- Only owner can call
- Sufficient balance available

#### `set_authorized_contract(contract_address: ContractAddress)`
Authorizes a contract to use the paymaster (owner only).

**Parameters:**
- `contract_address`: Address of contract to authorize

#### `remove_authorized_contract(contract_address: ContractAddress)`
Removes authorization from a contract (owner only).

**Parameters:**
- `contract_address`: Address of contract to deauthorize

#### `set_daily_limit(new_limit: u256)`
Sets the daily sponsorship limit (owner only).

**Parameters:**
- `new_limit`: New daily limit in STRK

#### `pause()`
Pauses the paymaster contract (owner only).

#### `unpause()`
Unpauses the paymaster contract (owner only).

#### `set_max_gas_estimate(max_gas: u256)`
Sets the maximum gas estimate allowed (owner only).

**Parameters:**
- `max_gas`: Maximum gas estimate allowed

### View Functions

#### `get_available_balance() -> u256`
Returns the available STRK balance for sponsorship.

#### `get_total_sponsored() -> u256`
Returns the total amount of STRK sponsored.

#### `get_daily_limit() -> u256`
Returns the current daily sponsorship limit.

#### `get_daily_usage() -> (u256, u64)`
Returns daily usage information.

**Returns:**
- `(amount_used, last_reset_day)`: Usage amount and last reset day

#### `is_paused() -> bool`
Returns whether the contract is paused.

## RemittanceEscrow Contract API

### Core Functions

#### `send_remittance(phone_hash: felt252, amount: u256) -> bool`
Sends a remittance to a phone number hash.

**Parameters:**
- `phone_hash`: Hashed phone number
- `amount`: Amount of STRK to send (including fee)

**Returns:**
- `bool`: True if remittance was sent successfully

**Requirements:**
- Amount must be greater than fee
- Amount within min/max limits
- Phone hash must not have pending remittance
- Contract not paused

#### `claim_remittance_gasless(phone_hash: felt252) -> bool`
Claims a remittance using gasless transaction.

**Parameters:**
- `phone_hash`: Hashed phone number

**Returns:**
- `bool`: True if claim was successful

**Requirements:**
- Remittance must exist and not be claimed
- Paymaster must be able to sponsor

#### `claim_remittance_manual(phone_hash: felt252) -> bool`
Claims a remittance with user paying gas.

**Parameters:**
- `phone_hash`: Hashed phone number

**Returns:**
- `bool`: True if claim was successful

**Requirements:**
- Remittance must exist and not be claimed

#### `refund_expired(phone_hash: felt252) -> bool`
Refunds an expired remittance.

**Parameters:**
- `phone_hash`: Hashed phone number

**Returns:**
- `bool`: True if refund was successful

**Requirements:**
- Remittance must be expired
- Remittance must not be claimed

### Administrative Functions

#### `set_paymaster_address(paymaster: ContractAddress)`
Sets the paymaster contract address (owner only).

**Parameters:**
- `paymaster`: Address of paymaster contract

#### `update_fee(new_fee: u256)`
Updates the remittance fee (owner only).

**Parameters:**
- `new_fee`: New fee amount

#### `withdraw_fees(amount: u256)`
Withdraws collected fees (owner only).

**Parameters:**
- `amount`: Amount to withdraw

#### `pause()`
Pauses the escrow contract (owner only).

#### `unpause()`
Unpauses the escrow contract (owner only).

#### `set_amount_limits(min_amount: u256, max_amount: u256)`
Sets minimum and maximum remittance amounts (owner only).

**Parameters:**
- `min_amount`: Minimum remittance amount
- `max_amount`: Maximum remittance amount

### View Functions

#### `get_pending_balance(phone_hash: felt252) -> u256`
Returns the pending balance for a phone hash.

**Parameters:**
- `phone_hash`: Hashed phone number

**Returns:**
- `u256`: Pending balance (0 if claimed)

#### `get_remittance_details(phone_hash: felt252) -> RemittanceInfo`
Returns detailed information about a remittance.

**Parameters:**
- `phone_hash`: Hashed phone number

**Returns:**
- `RemittanceInfo`: Remittance details

#### `get_collected_fees() -> u256`
Returns the total collected fees.

#### `is_paused() -> bool`
Returns whether the contract is paused.

## Data Structures

### `RemittanceInfo`
```cairo
struct RemittanceInfo {
    amount: u256,        // Net amount (after fee)
    sender: ContractAddress,  // Sender address
    timestamp: u64,      // Creation timestamp
    is_claimed: bool,    // Whether claimed
}
```

### `DailyUsage`
```cairo
struct DailyUsage {
    amount_used: u256,   // Amount used today
    last_reset_day: u64, // Last reset day
}
```

## Events

### Paymaster Events

#### `ClaimSponsored`
Emitted when a claim is successfully sponsored.

```cairo
struct ClaimSponsored {
    claimer: ContractAddress,
    calling_contract: ContractAddress,
    gas_amount: u256,
    timestamp: u64,
}
```

#### `PaymasterFunded`
Emitted when the paymaster is funded.

```cairo
struct PaymasterFunded {
    funder: ContractAddress,
    amount: u256,
    new_balance: u256,
    timestamp: u64,
}
```

#### `SponsorshipFailed`
Emitted when sponsorship fails.

```cairo
struct SponsorshipFailed {
    claimer: ContractAddress,
    calling_contract: ContractAddress,
    reason: felt252,
    timestamp: u64,
}
```

### RemittanceEscrow Events

#### `RemittanceSent`
Emitted when a remittance is sent.

```cairo
struct RemittanceSent {
    phone_hash: felt252,
    sender: ContractAddress,
    amount: u256,
    fee: u256,
    timestamp: u64,
}
```

#### `RemittanceClaimed`
Emitted when a remittance is claimed.

```cairo
struct RemittanceClaimed {
    phone_hash: felt252,
    claimer: ContractAddress,
    amount: u256,
    gasless: bool,
    timestamp: u64,
}
```

#### `RemittanceRefunded`
Emitted when a remittance is refunded.

```cairo
struct RemittanceRefunded {
    phone_hash: felt252,
    sender: ContractAddress,
    amount: u256,
    timestamp: u64,
}
```

## Error Handling

### Common Error Messages

- `'Not owner'`: Only owner can perform this action
- `'Contract is paused'`: Contract is currently paused
- `'Amount must be greater than fee'`: Insufficient amount for fee
- `'Amount too small'`: Amount below minimum limit
- `'Amount too large'`: Amount above maximum limit
- `'Invalid phone hash'`: Phone hash validation failed
- `'Phone has pending remittance'`: Phone already has pending remittance
- `'No remittance found'`: No remittance exists for phone hash
- `'Already claimed'`: Remittance already claimed
- `'Not expired yet'`: Remittance not yet expired
- `'Unauthorized contract'`: Contract not authorized for paymaster
- `'Cannot sponsor'`: Paymaster cannot sponsor transaction
- `'Insufficient balance'`: Insufficient balance for operation
- `'Token transfer failed'`: ERC20 transfer failed

## Gas Estimation

### Typical Gas Costs

- `send_remittance`: ~80,000 gas
- `claim_remittance_gasless`: ~50,000 gas
- `claim_remittance_manual`: ~40,000 gas
- `refund_expired`: ~30,000 gas

### Gas Optimization Tips

1. Batch operations when possible
2. Use gas-efficient data structures
3. Minimize storage operations
4. Cache frequently accessed data

## Best Practices

### For Developers

1. Always check return values
2. Handle errors gracefully
3. Use events for monitoring
4. Implement proper access control
5. Test thoroughly before deployment

### For Users

1. Verify phone hash before sending
2. Check remittance status before claiming
3. Monitor for expiry dates
4. Use gasless claims when possible
5. Keep sufficient STRK balance for fees

## Integration Examples

### JavaScript/TypeScript

```typescript
// Send remittance
const phoneHash = hashPhoneNumber("+1234567890");
const amount = 100;
const tx = await escrow.send_remittance(phoneHash, amount);

// Claim remittance
const claimTx = await escrow.claim_remittance_gasless(phoneHash);

// Check balance
const balance = await escrow.get_pending_balance(phoneHash);
```

### Python

```python
# Send remittance
phone_hash = hash_phone_number("+1234567890")
amount = 100
tx = escrow.send_remittance(phone_hash, amount)

# Claim remittance
claim_tx = escrow.claim_remittance_gasless(phone_hash)

# Check balance
balance = escrow.get_pending_balance(phone_hash)
```

## Support

For API questions and issues:
- Check the test files for examples
- Review the documentation
- Create an issue on GitHub
- Join the community Discord
