
/**Original counter*/
module counter::counter;

// 1. Track the current version of the module
const VERSION: u64 = 1;

public struct Counter has key {
    id: UID,
    // 2. Track the current version of the shared object
    version: u64,
    // 3. Associate the `Counter` with its `AdminCap`
    admin: ID,
    value: u64,
}

public struct AdminCap has key {
    id: UID,
}

/// Not the right admin for this counter
const ENotAdmin: u64 = 0;

/// Calling functions from the wrong package version
const EWrongVersion: u64 = 1;

fun init(ctx: &mut TxContext) {
    let admin = AdminCap {
        id: object::new(ctx),
    };

    transfer::share_object(Counter {
        id: object::new(ctx),
        version: VERSION,
        admin: object::id(&admin),
        value: 0,
    });

    transfer::transfer(admin, tx_context::sender(ctx));
}

public fun increment(c: &mut Counter) {
    // 4. Guard the entry of all functions that access the shared object
    //    with a version check.
    assert!(c.version == VERSION, EWrongVersion);
    c.value = c.value + 1;
}




// /**
// Upgraded counter code, check V1 commented out at the bottom of the file
// */
// module counter::counter;
//  use sui::event;

// // 1. Track the current version of the module
// const VERSION: u64 = 2;

// /// Not the right admin for this counter
// const ENotAdmin: u64 = 0;

// /// Calling functions from the wrong package version
// const EWrongVersion: u64 = 1;

// /// Migration is not an upgrade
// const ENotUpgrade: u64 = 2;


// public  struct AdminCap has key {
//     id: UID,
// }

// public struct Progress has copy, drop {
//     reached: u64,
// }

// public struct Counter has key {
//     id: UID,
//     // 2. Track the current version of the shared object
//     version: u64,
//     // 3. Associate the `Counter` with its `AdminCap`
//     admin: ID,
//     value: u64,
// }

// fun init(ctx: &mut TxContext) {
//     let admin = AdminCap {
//         id: object::new(ctx),
//     };

//     transfer::share_object(Counter {
//         id: object::new(ctx),
//         version: VERSION,
//         admin: object::id(&admin),
//         value: 0,
//     });

//     transfer::transfer(admin, tx_context::sender(ctx));
// }

// public fun increment(c: &mut Counter) {
//     assert!(c.version == VERSION, EWrongVersion);
//     c.value = c.value + 1;

//     if (c.value % 100 == 0) {
//         event::emit(Progress { reached: c.value })
//     }
// }

// // 2. Introduce a migrate function
// entry fun migrate(c: &mut Counter, a: &AdminCap) {
//     assert!(c.admin == object::id(a), ENotAdmin);
//     assert!(c.version < VERSION, ENotUpgrade);
//     c.version = VERSION;
// }





