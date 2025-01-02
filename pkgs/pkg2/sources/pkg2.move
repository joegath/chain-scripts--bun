
module pkg2::whitelist;

use sui::table::{Self, Table};

const ENotAuthorized: u64 = 0;
const ENotWhitelisted: u64 = 1;

public struct Whitelist has key {
    id: UID,
    admin: address,
    val: u64,
    whitelisteds: vector<address>,
    whitelisteds_map: Table<address, u64>,
}

fun init(
    ctx: &mut TxContext
) {
   let whitelist = Whitelist {
        id: object::new(ctx),
        admin: ctx.sender(),
        val: 0,
        whitelisteds: vector[],
        whitelisteds_map: table::new<address, u64>(ctx)
    };
    transfer::share_object(whitelist);
}

fun assert_admin(self: &Whitelist, ctx: &TxContext) {
    assert!(ctx.sender() == self.admin, ENotAuthorized);
}

public(package) fun is_whitelisted(self: &Whitelist, addr: address): bool {
    table::contains(&self.whitelisteds_map, addr)
}


 fun add_whitelisted(
    self: &mut Whitelist, 
    addr: address,
) {
    if(!is_whitelisted(self, addr)) {
        let index = table::length(&self.whitelisteds_map);
        table::add(&mut self.whitelisteds_map, addr, index);
        vector::push_back(&mut self.whitelisteds, addr);
    }
}


public entry fun add_whitelisteds(
    self: &mut Whitelist, 
    addrs: vector<address>,
    ctx: &TxContext
) {
    assert_admin(self, ctx);
    let len = vector::length(&addrs);
    let mut i = 0;
    
    while (i < len) {
        let addr = vector::borrow(&addrs, i);
        add_whitelisted(self, *addr);
        i = i + 1;
    };
}


/// Removes an address from the whitelist.
/// 
/// This function performs the following steps:
/// 1. Checks if the given `addr` is in the whitelist.
/// 2. If `addr` is in the whitelist:
///    - Retrieves the index of `addr` in the vector (`self.whitelisteds`) using the table.
///    - Removes the `addr` from the vector using `vector::swap_remove`.
///    - Updates the mapping (`self.whitelisteds_map`) if the removed element was not the last element in the vector.
///    - Removes the mapping entry for `addr`.
/// 
/// # Arguments:
/// - `self` (`&mut Whitelist`): The whitelist object to modify.
/// - `addr` (`address`): The address to be removed from the whitelist.
///
/// # Notes:
/// - The function uses `vector::swap_remove` to achieve O(1) removal from the vector. 
///   This operation may reorder elements in the vector.
/// - The `self.whitelisteds_map` ensures consistent indexing for elements in the vector.
fun remove_whitelisted(
    self: &mut Whitelist,
    addr: address,
) {
    // Step 1: Check if the address is whitelisted.
    if (is_whitelisted(self, addr)) {
        // Step 2: Retrieve the index of the address in the vector.
        let index = *table::borrow(&self.whitelisteds_map, addr);
        let last_index = vector::length(&self.whitelisteds) - 1;

        // Step 3: Remove the element at `index` from the vector using swap_remove.
        vector::swap_remove(&mut self.whitelisteds, index);

        // Step 4: If the removed element was not the last one, update the map.
        if (index < last_index) {
            // Retrieve the address that was swapped into the removed position.
            let swapped_addr = *vector::borrow(&self.whitelisteds, index);

            // Update the mapping for the swapped address.
            table::remove(&mut self.whitelisteds_map, swapped_addr);
            table::add(&mut self.whitelisteds_map, swapped_addr, index);
        };

        // Step 5: Remove the mapping entry for the original address.
        table::remove(&mut self.whitelisteds_map, addr);
    };
}


public entry fun remove_whitelisteds(
    self: &mut Whitelist,
    addrs: vector<address>, 
    ctx: &TxContext
) {
    assert_admin(self, ctx);
    let len = vector::length(&addrs);
    let mut i = 0;
    while (i < len) {
        let addr = vector::borrow(&addrs, i);
        remove_whitelisted(self, *addr);
        i = i + 1;
    };
}


public entry fun increment_val(
    self: &mut Whitelist,
    ctx: &TxContext
) {
    assert!(is_whitelisted(self, ctx.sender()), ENotWhitelisted);
    self.val = self.val + 1;

}