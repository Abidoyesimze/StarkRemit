use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

// Interface for STRK token transfers
#[starknet::interface]
trait IERC20<TContractState> {
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    fn transfer_from(ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256) -> bool;
    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
}

#[starknet::interface]
trait IPaymaster<TContractState> {
    fn sponsor_claim(ref self: TContractState, claimer: ContractAddress, gas_estimate: u256) -> bool;
    fn check_can_sponsor(self: @TContractState, gas_estimate: u256) -> bool;
    fn fund_paymaster(ref self: TContractState, amount: u256) -> bool;
    fn emergency_withdraw(ref self: TContractState, amount: u256);
    fn set_authorized_contract(ref self: TContractState, contract_address: ContractAddress);
    fn remove_authorized_contract(ref self: TContractState, contract_address: ContractAddress);
    fn get_available_balance(self: @TContractState) -> u256;
    fn get_total_sponsored(self: @TContractState) -> u256;
    fn get_daily_limit(self: @TContractState) -> u256;
    fn set_daily_limit(ref self: TContractState, new_limit: u256);
    fn get_daily_usage(self: @TContractState) -> (u256, u64); // (amount_used, last_reset_day)
}

#[derive(Drop, Serde, starknet::Store)]
struct DailyUsage {
    amount_used: u256,
    last_reset_day: u64, // Day number since epoch
}

#[starknet::contract]
mod PaymasterContract {
    use super::{IPaymaster, IERC20Dispatcher, ContractAddress, get_caller_address, get_block_timestamp, DailyUsage};
    use starknet::storage::{Map, StoragePointerReadAccess, StoragePointerWriteAccess};
    use core::starknet::event::EventEmitter;

    #[storage]
    struct Storage {
        owner: ContractAddress,
        token_address: ContractAddress, // STRK token address
        authorized_contracts: Map<ContractAddress, bool>,
        available_balance: u256, // ETH balance for gas sponsorship
        total_sponsored: u256, // Total amount sponsored (for stats)
        daily_limit: u256, // Maximum daily sponsorship limit
        daily_usage: DailyUsage, // Track daily usage
        gas_price_multiplier: u256, // Multiplier for gas estimation (e.g., 150 = 1.5x)
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ClaimSponsored: ClaimSponsored,
        PaymasterFunded: PaymasterFunded,
        ContractAuthorized: ContractAuthorized,
        ContractUnauthorized: ContractUnauthorized,
        EmergencyWithdrawal: EmergencyWithdrawal,
        DailyLimitUpdated: DailyLimitUpdated,
        SponsorshipFailed: SponsorshipFailed,
    }

    #[derive(Drop, starknet::Event)]
    struct ClaimSponsored {
        #[key]
        claimer: ContractAddress,
        calling_contract: ContractAddress,
        gas_amount: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct PaymasterFunded {
        #[key]
        funder: ContractAddress,
        amount: u256,
        new_balance: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct ContractAuthorized {
        #[key]
        contract_address: ContractAddress,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct ContractUnauthorized {
        #[key]
        contract_address: ContractAddress,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct EmergencyWithdrawal {
        #[key]
        owner: ContractAddress,
        amount: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct DailyLimitUpdated {
        old_limit: u256,
        new_limit: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct SponsorshipFailed {
        #[key]
        claimer: ContractAddress,
        calling_contract: ContractAddress,
        reason: felt252,
        timestamp: u64,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        token_address: ContractAddress,
        initial_daily_limit: u256
    ) {
        self.owner.write(owner);
        self.token_address.write(token_address);
        self.daily_limit.write(initial_daily_limit);
        self.gas_price_multiplier.write(150); // 1.5x multiplier for safety
        
        // Initialize daily usage
        let daily_usage = DailyUsage {
            amount_used: 0,
            last_reset_day: self._get_current_day(),
        };
        self.daily_usage.write(daily_usage);
    }

    #[abi(embed_v0)]
    impl PaymasterImpl of IPaymaster<ContractState> {
        fn sponsor_claim(ref self: ContractState, claimer: ContractAddress, gas_estimate: u256) -> bool {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();

            // Check if calling contract is authorized
            if !self.authorized_contracts.read(caller) {
                self.emit(SponsorshipFailed {
                    claimer,
                    calling_contract: caller,
                    reason: 'Unauthorized contract',
                    timestamp,
                });
                return false;
            }

            // Calculate actual gas cost with multiplier
            let gas_cost = gas_estimate * self.gas_price_multiplier.read() / 100;

            // Check if we can sponsor this transaction
            if !self._can_sponsor_internal(gas_cost) {
                self.emit(SponsorshipFailed {
                    claimer,
                    calling_contract: caller,
                    reason: 'Cannot sponsor',
                    timestamp,
                });
                return false;
            }

            // Update balances and daily usage
            self._update_sponsorship_tracking(gas_cost);

            // Emit success event
            self.emit(ClaimSponsored {
                claimer,
                calling_contract: caller,
                gas_amount: gas_cost,
                timestamp,
            });

            true
        }

        fn check_can_sponsor(self: @ContractState, gas_estimate: u256) -> bool {
            let gas_cost = gas_estimate * self.gas_price_multiplier.read() / 100;
            self._can_sponsor_internal(gas_cost)
        }

        fn fund_paymaster(ref self: ContractState, amount: u256) -> bool {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();

            // Transfer STRK tokens from caller to this contract
            let token_contract = IERC20Dispatcher { contract_address: self.token_address.read() };
            let transfer_success = token_contract.transfer_from(
                caller, 
                starknet::get_contract_address(), 
                amount
            );

            if !transfer_success {
                return false;
            }

            // Update available balance
            let current_balance = self.available_balance.read();
            let new_balance = current_balance + amount;
            self.available_balance.write(new_balance);

            // Emit event
            self.emit(PaymasterFunded {
                funder: caller,
                amount,
                new_balance,
                timestamp,
            });

            true
        }

        fn emergency_withdraw(ref self: ContractState, amount: u256) {
            self._assert_only_owner();
            let current_balance = self.available_balance.read();
            assert(amount <= current_balance, 'Insufficient balance');

            // Update balance
            self.available_balance.write(current_balance - amount);

            // Transfer tokens to owner
            let token_contract = IERC20Dispatcher { contract_address: self.token_address.read() };
            let transfer_success = token_contract.transfer(self.owner.read(), amount);
            assert(transfer_success, 'Emergency withdrawal failed');

            // Emit event
            self.emit(EmergencyWithdrawal {
                owner: self.owner.read(),
                amount,
                timestamp: get_block_timestamp(),
            });
        }

        fn set_authorized_contract(ref self: ContractState, contract_address: ContractAddress) {
            self._assert_only_owner();
            self.authorized_contracts.write(contract_address, true);

            self.emit(ContractAuthorized {
                contract_address,
                timestamp: get_block_timestamp(),
            });
        }

        fn remove_authorized_contract(ref self: ContractState, contract_address: ContractAddress) {
            self._assert_only_owner();
            self.authorized_contracts.write(contract_address, false);

            self.emit(ContractUnauthorized {
                contract_address,
                timestamp: get_block_timestamp(),
            });
        }

        fn get_available_balance(self: @ContractState) -> u256 {
            self.available_balance.read()
        }

        fn get_total_sponsored(self: @ContractState) -> u256 {
            self.total_sponsored.read()
        }

        fn get_daily_limit(self: @ContractState) -> u256 {
            self.daily_limit.read()
        }

        fn set_daily_limit(ref self: ContractState, new_limit: u256) {
            self._assert_only_owner();
            let old_limit = self.daily_limit.read();
            self.daily_limit.write(new_limit);

            self.emit(DailyLimitUpdated {
                old_limit,
                new_limit,
                timestamp: get_block_timestamp(),
            });
        }

        fn get_daily_usage(self: @ContractState) -> (u256, u64) {
            let usage = self.daily_usage.read();
            (usage.amount_used, usage.last_reset_day)
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _can_sponsor_internal(self: @ContractState, gas_cost: u256) -> bool {
            // Check available balance
            let available = self.available_balance.read();
            if gas_cost > available {
                return false;
            }

            // Check daily limit
            let current_day = self._get_current_day();
            let mut daily_usage = self.daily_usage.read();

            // Reset daily usage if it's a new day
            if daily_usage.last_reset_day < current_day {
                daily_usage.amount_used = 0;
                daily_usage.last_reset_day = current_day;
            }

            let daily_limit = self.daily_limit.read();
            if daily_usage.amount_used + gas_cost > daily_limit {
                return false;
            }

            true
        }

        fn _update_sponsorship_tracking(ref self: ContractState, gas_cost: u256) {
            // Update available balance
            let current_balance = self.available_balance.read();
            self.available_balance.write(current_balance - gas_cost);

            // Update total sponsored
            let total_sponsored = self.total_sponsored.read();
            self.total_sponsored.write(total_sponsored + gas_cost);

            // Update daily usage
            let current_day = self._get_current_day();
            let mut daily_usage = self.daily_usage.read();

            // Reset if new day
            if daily_usage.last_reset_day < current_day {
                daily_usage.amount_used = gas_cost;
                daily_usage.last_reset_day = current_day;
            } else {
                daily_usage.amount_used += gas_cost;
            }

            self.daily_usage.write(daily_usage);
        }

        fn _get_current_day(self: @ContractState) -> u64 {
            // Convert timestamp to day number (86400 seconds per day)
            get_block_timestamp() / 86400
        }

        fn _assert_only_owner(self: @ContractState) {
            let caller = get_caller_address();
            let owner = self.owner.read();
            assert(caller == owner, 'Not owner');
        }
    }
}