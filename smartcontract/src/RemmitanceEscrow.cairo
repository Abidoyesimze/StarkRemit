use starknet::{ContractAddress, get_caller_address, get_block_timestamp, eth_signature::Signature};
use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

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
    use super::{IRemittanceEscrow, IPaymaster, RemittanceInfo, IERC20Dispatcher, ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::{Map, StoragePointerReadAccess, StoragePointerWriteAccess};
    use core::starknet::event::EventEmitter;

    #[storage]
    struct Storage {
        owner: ContractAddress,
        paymaster_address: ContractAddress,
        token_address: ContractAddress, // STRK token address
        transfer_fee: u256,
        escrows: Map<felt252, RemittanceInfo>,
        collected_fees: u256,
        expiry_duration: u64, // 90 days in seconds
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
        self.expiry_duration.write(7776000); // 90 days in seconds
    }

    #[abi(embed_v0)]
    impl RemittanceEscrowImpl of IRemittanceEscrow<ContractState> {
        fn send_remittance(ref self: ContractState, phone_hash: felt252, amount: u256) -> bool {
            let caller = get_caller_address();
            let fee = self.transfer_fee.read();
            let timestamp = get_block_timestamp();

            // Validate inputs
            assert(amount > fee, 'Amount must be greater than fee');
            assert(phone_hash != 0, 'Invalid phone hash');

            // Check if phone_hash already has pending remittance
            let existing_remittance = self.escrows.read(phone_hash);
            assert(existing_remittance.amount == 0 || existing_remittance.is_claimed, 'Phone has pending remittance');

            let net_amount = amount - fee;

            // Transfer tokens from sender to this contract
            let token_contract = IERC20Dispatcher { contract_address: self.token_address.read() };
            let transfer_success = token_contract.transfer_from(caller, starknet::get_contract_address(), amount);
            assert(transfer_success, 'Token transfer failed');

            // Store remittance info
            let remittance_info = RemittanceInfo {
                amount: net_amount,
                sender: caller,
                timestamp,
                is_claimed: false,
            };
            self.escrows.write(phone_hash, remittance_info);

            // Add fee to collected fees
            let current_fees = self.collected_fees.read();
            self.collected_fees.write(current_fees + fee);

            // Emit event
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

            // Validate claim
            assert(remittance.amount > 0, 'No remittance found');
            assert(!remittance.is_claimed, 'Already claimed');

            // Try to use paymaster for gas
            let paymaster_addr = self.paymaster_address.read();
            let gas_estimate: u256 = 50000; // Estimated gas for claim transaction

            let paymaster = IPaymasterDispatcher { contract_address: paymaster_addr };
            let can_sponsor = paymaster.check_can_sponsor(gas_estimate);

            if !can_sponsor {
                // Paymaster cannot sponsor, return false to indicate fallback needed
                return false;
            }

            // Sponsor the transaction
            let sponsored = paymaster.sponsor_claim(claimer, gas_estimate);
            assert(sponsored, 'Paymaster sponsorship failed');

            // Execute the claim
            self._execute_claim(phone_hash, claimer, true);

            true
        }

        fn claim_remittance_manual(ref self: ContractState, phone_hash: felt252) -> bool {
            let claimer = get_caller_address();
            let remittance = self.escrows.read(phone_hash);

            // Validate claim
            assert(remittance.amount > 0, 'No remittance found');
            assert(!remittance.is_claimed, 'Already claimed');

            // Execute the claim (user pays gas)
            self._execute_claim(phone_hash, claimer, false);

            true
        }

        fn refund_expired(ref self: ContractState, phone_hash: felt252) -> bool {
            let remittance = self.escrows.read(phone_hash);
            let current_time = get_block_timestamp();
            let expiry_duration = self.expiry_duration.read();

            // Validate refund conditions
            assert(remittance.amount > 0, 'No remittance found');
            assert(!remittance.is_claimed, 'Already claimed');
            assert(current_time >= remittance.timestamp + expiry_duration, 'Not expired yet');

            // Mark as claimed to prevent double refund
            let mut updated_remittance = remittance;
            updated_remittance.is_claimed = true;
            self.escrows.write(phone_hash, updated_remittance);

            // Emit refund event
            self.emit(RemittanceRefunded {
                phone_hash,
                sender: remittance.sender,
                amount: remittance.amount,
                timestamp: current_time,
            });

            // Note: In a real implementation, you'd transfer the funds back to sender here
            // For now, we just mark it as refunded

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

            // Transfer collected fees to owner
            let token_contract = IERC20Dispatcher { contract_address: self.token_address.read() };
            let transfer_success = token_contract.transfer(self.owner.read(), amount);
            assert(transfer_success, 'Fee withdrawal failed');
        }

        fn get_collected_fees(self: @ContractState) -> u256 {
            self.collected_fees.read()
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _execute_claim(ref self: ContractState, phone_hash: felt252, claimer: ContractAddress, gasless: bool) {
            let remittance = self.escrows.read(phone_hash);
            let timestamp = get_block_timestamp();

            // Mark as claimed
            let mut updated_remittance = remittance;
            updated_remittance.is_claimed = true;
            self.escrows.write(phone_hash, updated_remittance);

            // Transfer tokens to claimer
            let token_contract = IERC20Dispatcher { contract_address: self.token_address.read() };
            let transfer_success = token_contract.transfer(claimer, remittance.amount);
            assert(transfer_success, 'Token transfer failed');

            // Emit claim event
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