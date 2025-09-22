# StarkRemit - Gasless Remittance System on Starknet

StarkRemit is a revolutionary gasless remittance system built on Starknet that enables users to send money to phone numbers without paying gas fees. The system uses a sophisticated paymaster mechanism to sponsor gas fees, making remittances accessible to users regardless of their crypto knowledge or gas token holdings.

## 🌟 Features

- **Gasless Transactions**: Send remittances without paying gas fees
- **Phone Number Integration**: Send money using phone number hashes
- **Automatic Gas Sponsorship**: Paymaster contract sponsors gas fees
- **Daily Limits**: Configurable daily sponsorship limits
- **Expiry Mechanism**: Automatic refunds for unclaimed remittances
- **Security Features**: Pause functionality, amount limits, and comprehensive validation
- **Fee Collection**: Built-in fee collection system for sustainability

## 🏗️ Architecture

StarkRemit consists of two main smart contracts:

### 1. Paymaster Contract
- Sponsors gas fees for authorized contracts
- Manages daily limits and balances
- Handles STRK token funding and withdrawals
- Tracks usage and prevents abuse

### 2. RemittanceEscrow Contract
- Handles remittance transactions
- Manages phone number hashing
- Implements expiry and refund mechanisms
- Integrates with Paymaster for gas sponsorship

## 🚀 Quick Start

### Prerequisites
- Starknet Foundry installed
- STRK tokens for deployment and funding
- Valid Starknet account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd StarkRemit
```

2. Install dependencies:
```bash
cd smartcontract
scarb build
```

3. Run tests:
```bash
scarb test
```

### Deployment

1. Configure deployment parameters in `config/deployment_config.cairo`
2. Deploy the full system:
```bash
starknet run scripts/deploy_full_system.cairo
```

## 📖 Usage

### Sending a Remittance

```cairo
// Send 100 STRK to phone number +1234567890
let phone_hash = hash_phone_number("+1234567890");
let amount = 100;
let success = escrow.send_remittance(phone_hash, amount);
```

### Claiming a Remittance

```cairo
// Gasless claim (if paymaster can sponsor)
let success = escrow.claim_remittance_gasless(phone_hash);

// Manual claim (user pays gas)
let success = escrow.claim_remittance_manual(phone_hash);
```

### Managing the System

```cairo
// Fund the paymaster
paymaster.fund_paymaster(5000);

// Set daily limits
paymaster.set_daily_limit(10000);

// Pause/unpause system
escrow.pause();
escrow.unpause();
```

## 🔧 Configuration

### Paymaster Configuration
- `daily_limit`: Maximum STRK sponsored per day
- `initial_funding`: Initial STRK funding amount
- `gas_multiplier`: Safety multiplier for gas estimation
- `max_gas_estimate`: Maximum gas estimate allowed

### RemittanceEscrow Configuration
- `fee`: STRK fee per remittance
- `expiry_days`: Days before unclaimed remittances expire
- `max_amount`: Maximum remittance amount
- `min_amount`: Minimum remittance amount

## 🛡️ Security Features

- **Pause Mechanism**: Emergency pause functionality
- **Amount Limits**: Configurable min/max remittance amounts
- **Input Validation**: Comprehensive input validation
- **Access Control**: Owner-based administrative functions
- **Daily Limits**: Prevents abuse and excessive usage
- **Gas Limits**: Maximum gas estimate validation

## 📊 Monitoring

Monitor these key metrics:
- Paymaster balance and daily usage
- Remittance transaction volume
- Failed gasless claims
- Expired remittances requiring refunds

## 🧪 Testing

The project includes comprehensive tests:

- **Unit Tests**: Individual contract function tests
- **Integration Tests**: End-to-end system tests
- **Security Tests**: Security vulnerability tests
- **Gas Tests**: Gas usage optimization tests

Run tests:
```bash
scarb test
```

## 📚 Documentation

- [Deployment Guide](smartcontract/DEPLOYMENT.md)
- [Security Audit](smartcontract/SECURITY_AUDIT.md)
- [Gas Optimization](smartcontract/GAS_OPTIMIZATION.md)
- [API Reference](docs/API.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the test files for examples

## 🔮 Roadmap

- [ ] Multi-signature wallet integration
- [ ] DAO governance system
- [ ] Advanced monitoring dashboard
- [ ] Mobile app integration
- [ ] Cross-chain remittance support

## ⚠️ Disclaimer

This software is provided "as is" without warranty. Use at your own risk. Always test thoroughly before deploying to mainnet.

---

**StarkRemit** - Making remittances accessible to everyone, powered by Starknet.
