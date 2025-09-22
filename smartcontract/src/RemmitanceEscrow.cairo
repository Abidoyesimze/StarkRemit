use starknet::{ContractAddress, get_caller_address, get_block_timestamp};

// Interface for STRK token transfers
#[starknet::interface]
trait IERC20<TContractState> {
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    fn transfer_from(ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256) -> bool;
    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
}

#[starknet::interface]
trait IRemittanceEscrow<TContractState> {
    fn send_remittance(ref self: TContractState, phone_hash: felt252, amount: u256) -> bool;
    fn claim_remittance_gasless(ref self: TContractState, phone_hash: felt252) -> bool;
    fn claim_remittance_manual(ref self: TContractState, phone_hash: felt252) -> bool;
    fn refund_expired(ref self: TContractState, phone_hash: felt252) -> bool;
    fn get_pending_balance(self: @TContractState, phone_hash: felt252) -> u256;
    fn get_remittance_details(self: @TContractState, phone_hash: felt252) -> RemittanceInfo;
    fn set_paymaster_address(ref self: TContractState, paymaster: ContractAddress);
    fn update_fee(ref self: TContractState, new_fee: u256);
    fn withdraw_fees(ref self: TContractState, amount: u256);
    fn get_collected_fees(self: @TContractState) -> u256;
    fn pause(ref self: TContractState);
    fn unpause(ref self: TContractState);
    fn is_paused(self: @TContractState) -> bool;
    fn set_amount_limits(ref self: TContractState, min_amount: u256, max_amount: u256);
}

#[starknet::interface]
trait IPaymaster<TContractState> {
    fn sponsor_claim(ref self: TContractState, claimer: ContractAddress, gas_estimate: u256) -> bool;
    fn check_can_sponsor(self: @TContractState, gas_estimate: u256) -> bool;
}

#[derive(Drop, Serde, starknet::Store)]
struct RemittanceInfo {
    amount: u256,
    sender: ContractAddress,
    timestamp: u64,
    is_claimed: bool,
}

#[starknet::contract]
mod RemittanceEscrow {
    use super::{IRemittanceEscrow, IPaymasterDispatcher, IPaymasterDispatcherTrait, RemittanceInfo, IERC20Dispatcher, IERC20DispatcherTrait, ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::event::EventEmitter;

    #[storage]
    struct Storage {
        owner: ContractAddress,
        paymaster_address: ContractAddress,
        token_address: ContractAddress,
        transfer_fee: u256,
        escrows: Map<felt252, RemittanceInfo>,
        collected_fees: u256,
        expiry_duration: u64,
        max_remittance_amount: u256,
        min_remittance_amount: u256,
        is_paused: bool,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        RemittanceSent: RemittanceSent,
        RemittanceClaimed: RemittanceClaimed,
        RemittanceRefunded: RemittanceRefunded,
        FeeUpdated: FeeUpdated,
        PaymasterUpdated: PaymasterUpdated,
    }

    #[derive(Drop, starknet::Event)]
    struct RemittanceSent {
        #[key]
        phone_hash: felt252,
        sender: ContractAddress,
        amount: u256,
        fee: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct RemittanceClaimed {
        #[key]
        phone_hash: felt252,
        claimer: ContractAddress,
        amount: u256,
        gasless: bool,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct RemittanceRefunded {
        #[key]
        phone_hash: felt252,
        sender: ContractAddress,
        amount: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct FeeUpdated {
        old_fee: u256,
        new_fee: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct PaymasterUpdated {
        old_paymaster: ContractAddress,
        new_paymaster: ContractAddress,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, 
        owner: ContractAddress,
        paymaster_address: ContractAddress,
        token_address: ContractAddress,
        initial_fee: u256
    ) {
        self.owner.write(owner);
        self.paymaster_address.write(paymaster_address);
        self.token_address.write(token_address);
        self.transfer_fee.write(initial_fee);
        self.expiry_duration.write(7776000);
        self.max_remittance_amount.write(1000000);
        self.min_remittance_amount.write(1);
        self.is_paused.write(false);
    }

    #[abi(embed_v0)]
    impl RemittanceEscrowImpl of IRemittanceEscrow<ContractState> {
        fn send_remittance(ref self: ContractState, phone_hash: felt252, amount: u256) -> bool {
            assert(!self.is_paused.read(), 'Contract is paused');
            
            let caller = get_caller_address();
            let fee = self.transfer_fee.read();
            let timestamp = get_block_timestamp();

            assert(amount > fee, 'Amount must be greater than fee');
            assert(amount >= self.min_remittance_amount.read(), 'Amount too small');
            assert(amount <= self.max_remittance_amount.read(), 'Amount too large');
            assert(phone_hash != 0, 'Invalid phone hash');

            let existing_remittance = self.escrows.read(phone_hash);
            assert(existing_remittance.amount == 0 || existing_remittance.is_claimed, 'Phone has pending remittance');

            let net_amount = amount - fee;

            let token_contract = IERC20Dispatcher { contract_address: self.token_address.read() };
            let transfer_success = token_contract.transfer_from(caller, starknet::get_contract_address(), amount);
            assert(transfer_success, 'Token transfer failed');

            let current_fees = self.collected_fees.read();
            
            let remittance_info = RemittanceInfo {
                amount: net_amount,
                sender: caller,
                timestamp,
                is_claimed: false,
            };
            self.escrows.write(phone_hash, remittance_info);
            
            self.collected_fees.write(current_fees + fee);

            self.emit(RemittanceSent {
                phone_hash,
                sender: caller,
                amount: net_amount,
                fee,
                timestamp,
            });

            true
        }

        fn claim_remittance_gasless(ref self: ContractState, phone_hash: felt252) -> bool {
            let claimer = get_caller_address();
            let remittance = self.escrows.read(phone_hash);

            assert(remittance.amount > 0, 'No remittance found');
            assert(!remittance.is_claimed, 'Already claimed');

            let paymaster_addr = self.paymaster_address.read();
            let gas_estimate: u256 = 50000;

            let paymaster = IPaymasterDispatcher { contract_address: paymaster_addr };
            let can_sponsor = paymaster.check_can_sponsor(gas_estimate);

            if !can_sponsor {
                return false;
            }

            let sponsored = paymaster.sponsor_claim(claimer, gas_estimate);
            assert(sponsored, 'Paymaster sponsorship failed');

            self._execute_claim(phone_hash, claimer, true);

            true
        }

        fn claim_remittance_manual(ref self: ContractState, phone_hash: felt252) -> bool {
            let claimer = get_caller_address();
            let remittance = self.escrows.read(phone_hash);

            assert(remittance.amount > 0, 'No remittance found');
            assert(!remittance.is_claimed, 'Already claimed');

            self._execute_claim(phone_hash, claimer, false);

            true
        }

        fn refund_expired(ref self: ContractState, phone_hash: felt252) -> bool {
            let remittance = self.escrows.read(phone_hash);
            let current_time = get_block_timestamp();
            let expiry_duration = self.expiry_duration.read();

            assert(remittance.amount > 0, 'No remittance found');
            assert(!remittance.is_claimed, 'Already claimed');
            assert(current_time >= remittance.timestamp + expiry_duration, 'Not expired yet');

            let updated_remittance = RemittanceInfo {
                amount: remittance.amount,
                sender: remittance.sender,
                timestamp: remittance.timestamp,
                is_claimed: true,
            };
            self.escrows.write(phone_hash, updated_remittance);

            self.emit(RemittanceRefunded {
                phone_hash,
                sender: remittance.sender,
                amount: remittance.amount,
                timestamp: current_time,
            });

            true
        }

        fn get_pending_balance(self: @ContractState, phone_hash: felt252) -> u256 {
            let remittance = self.escrows.read(phone_hash);
            if remittance.is_claimed {
                0
            } else {
                remittance.amount
            }
        }

        fn get_remittance_details(self: @ContractState, phone_hash: felt252) -> RemittanceInfo {
            self.escrows.read(phone_hash)
        }

        fn set_paymaster_address(ref self: ContractState, paymaster: ContractAddress) {
            self._assert_only_owner();
            let old_paymaster = self.paymaster_address.read();
            self.paymaster_address.write(paymaster);

            self.emit(PaymasterUpdated {
                old_paymaster,
                new_paymaster: paymaster,
            });
        }

        fn update_fee(ref self: ContractState, new_fee: u256) {
            self._assert_only_owner();
            let old_fee = self.transfer_fee.read();
            self.transfer_fee.write(new_fee);

            self.emit(FeeUpdated {
                old_fee,
                new_fee,
            });
        }

        fn withdraw_fees(ref self: ContractState, amount: u256) {
            self._assert_only_owner();
            let current_fees = self.collected_fees.read();
            assert(amount <= current_fees, 'Insufficient fees');

            self.collected_fees.write(current_fees - amount);

            let token_contract = IERC20Dispatcher { contract_address: self.token_address.read() };
            let transfer_success = token_contract.transfer(self.owner.read(), amount);
            assert(transfer_success, 'Fee withdrawal failed');
        }

        fn get_collected_fees(self: @ContractState) -> u256 {
            self.collected_fees.read()
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

        fn set_amount_limits(ref self: ContractState, min_amount: u256, max_amount: u256) {
            self._assert_only_owner();
            assert(min_amount > 0, 'Min amount must be positive');
            assert(max_amount > min_amount, 'Max must be greater than min');
            assert(max_amount <= 10000000, 'Max amount too large');
            
            self.min_remittance_amount.write(min_amount);
            self.max_remittance_amount.write(max_amount);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _execute_claim(ref self: ContractState, phone_hash: felt252, claimer: ContractAddress, gasless: bool) {
            let remittance = self.escrows.read(phone_hash);
            let timestamp = get_block_timestamp();

            let updated_remittance = RemittanceInfo {
                amount: remittance.amount,
                sender: remittance.sender,
                timestamp: remittance.timestamp,
                is_claimed: true,
            };
            self.escrows.write(phone_hash, updated_remittance);

            let token_contract = IERC20Dispatcher { contract_address: self.token_address.read() };
            let transfer_success = token_contract.transfer(claimer, remittance.amount);
            assert(transfer_success, 'Token transfer failed');

            self.emit(RemittanceClaimed {
                phone_hash,
                claimer,
                amount: remittance.amount,
                gasless,
                timestamp,
            });
        }

        fn _assert_only_owner(self: @ContractState) {
            let caller = get_caller_address();
            let owner = self.owner.read();
            assert(caller == owner, 'Not owner');
        }
    }
}