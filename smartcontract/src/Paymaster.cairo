use starknet::{ContractAddress, get_caller_address, get_block_timestamp};

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
    fn get_daily_usage(self: @TContractState) -> (u256, u64);
    fn pause(ref self: TContractState);
    fn unpause(ref self: TContractState);
    fn is_paused(self: @TContractState) -> bool;
    fn set_max_gas_estimate(ref self: TContractState, max_gas: u256);
}

#[derive(Drop, Serde, starknet::Store)]
struct DailyUsage {
    amount_used: u256,
    last_reset_day: u64,
}

#[starknet::contract]
mod PaymasterContract {
    use super::{IPaymaster, IERC20Dispatcher, IERC20DispatcherTrait, ContractAddress, get_caller_address, get_block_timestamp, DailyUsage};
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::event::EventEmitter;

    #[storage]
    struct Storage {
        owner: ContractAddress,
        token_address: ContractAddress,
        authorized_contracts: Map<ContractAddress, bool>,
        available_balance: u256,
        total_sponsored: u256,
        daily_limit: u256,
        daily_usage: DailyUsage,
        gas_price_multiplier: u256,
        max_gas_estimate: u256,
        is_paused: bool,
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
        self.gas_price_multiplier.write(150);
        self.max_gas_estimate.write(100000);
        self.is_paused.write(false);
        
        let daily_usage = DailyUsage {
            amount_used: 0,
            last_reset_day: self._get_current_day(),
        };
        self.daily_usage.write(daily_usage);
    }

    #[abi(embed_v0)]
    impl PaymasterImpl of IPaymaster<ContractState> {
        fn sponsor_claim(ref self: ContractState, claimer: ContractAddress, gas_estimate: u256) -> bool {
            if self.is_paused.read() {
                return false;
            }
            
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();

            assert(gas_estimate > 0, 'Invalid gas estimate');
            assert(gas_estimate <= self.max_gas_estimate.read(), 'Gas estimate too large');

            if !self.authorized_contracts.read(caller) {
                self.emit(SponsorshipFailed {
                    claimer,
                    calling_contract: caller,
                    reason: 'Unauthorized contract',
                    timestamp,
                });
                return false;
            }

            let gas_cost = gas_estimate * self.gas_price_multiplier.read() / 100;

            if !self._can_sponsor_internal(gas_cost) {
                self.emit(SponsorshipFailed {
                    claimer,
                    calling_contract: caller,
                    reason: 'Cannot sponsor',
                    timestamp,
                });
                return false;
            }

            self._update_sponsorship_tracking(gas_cost);

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

            let token_contract = IERC20Dispatcher { contract_address: self.token_address.read() };
            let transfer_success = token_contract.transfer_from(
                caller, 
                starknet::get_contract_address(), 
                amount
            );

            if !transfer_success {
                return false;
            }

            let current_balance = self.available_balance.read();
            let new_balance = current_balance + amount;
            self.available_balance.write(new_balance);

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

            self.available_balance.write(current_balance - amount);

            let token_contract = IERC20Dispatcher { contract_address: self.token_address.read() };
            let transfer_success = token_contract.transfer(self.owner.read(), amount);
            assert(transfer_success, 'Emergency withdrawal failed');

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

        fn pause(ref self: ContractState) {
            self._assert_only_owner();
            self.is_paused.write(true);
        }

        fn unpause(ref self: ContractState) {
            self._assert_only_owner();
            self.is_paused.write(false);
        }

        fn is_paused(self: @ContractState) -> bool {
            self.is_paused.read()
        }

        fn set_max_gas_estimate(ref self: ContractState, max_gas: u256) {
            self._assert_only_owner();
            assert(max_gas > 0, 'Max gas must be positive');
            assert(max_gas <= 1000000, 'Max gas too large');
            self.max_gas_estimate.write(max_gas);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _can_sponsor_internal(self: @ContractState, gas_cost: u256) -> bool {
            let available = self.available_balance.read();
            if gas_cost > available {
                return false;
            }

            let current_day = self._get_current_day();
            let mut daily_usage = self.daily_usage.read();

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
            let current_balance = self.available_balance.read();
            let total_sponsored = self.total_sponsored.read();
            let current_day = self._get_current_day();
            let mut daily_usage = self.daily_usage.read();

            self.available_balance.write(current_balance - gas_cost);
            self.total_sponsored.write(total_sponsored + gas_cost);

            if daily_usage.last_reset_day < current_day {
                daily_usage.amount_used = gas_cost;
                daily_usage.last_reset_day = current_day;
            } else {
                daily_usage.amount_used += gas_cost;
            }

            self.daily_usage.write(daily_usage);
        }

        fn _get_current_day(self: @ContractState) -> u64 {
            get_block_timestamp() / 86400
        }

        fn _assert_only_owner(self: @ContractState) {
            let caller = get_caller_address();
            let owner = self.owner.read();
            assert(caller == owner, 'Not owner');
        }
    }
}