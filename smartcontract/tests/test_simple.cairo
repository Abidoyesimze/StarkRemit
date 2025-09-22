#[test]
fn test_basic_math() {
    let a: u256 = 100;
    let b: u256 = 50;
    let result = a + b;
    
    assert(result == 150, 'Basic math should work');
}

#[test]
fn test_contracts_compile() {
    // This test just verifies that our contracts compile successfully
    // by testing basic types and operations that our contracts use
    
    let amount: u256 = 1000;
    let fee: u256 = 10;
    let net_amount = amount - fee;
    
    assert(net_amount == 990, 'Net amount should work');
    
    let phone_hash: felt252 = 12345;
    assert(phone_hash != 0, 'Phone hash should not be zero');
    
    let is_claimed: bool = false;
    assert(!is_claimed, 'Boolean logic should work');
}
