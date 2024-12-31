
module pkg1::pkg1;

const VERSION: u64 = 2;

const ENotAuthorized: u64 = 0;
const EWrongVersion: u64 = 1;
const ENotUpgrade: u64 = 2;

public struct Struct1 has key {
    id: UID,
    version: u64,
    admin: address,
    val1: u64
}

fun init (ctx: &mut TxContext) {
    let struct1 = Struct1 {
        id: object::new(ctx),
        version: VERSION,
        admin: ctx.sender(),
        val1: 1
    };
    transfer::share_object(struct1);
}

public entry fun update_val1(
    struct1: &mut Struct1, 
    new_val: u64, 
    ctx: &mut TxContext
) {
    assert!(ctx.sender() == struct1.admin, ENotAuthorized);
    assert!(struct1.version == VERSION, EWrongVersion);
    struct1.val1 = new_val;
}

entry fun migrate(struct1: &mut Struct1, ctx: &TxContext) {
    assert!(ctx.sender() == struct1.admin, ENotAuthorized);
    assert!(struct1.version < VERSION, ENotUpgrade);
    struct1.version = VERSION;
}


