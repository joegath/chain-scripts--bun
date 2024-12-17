import { BN } from "turbos-clmm-sdk";
import { NetworksEnum } from "../../lib/sui";
import { turbosSdk } from "../../lib/turbos";
import { computeLiquidity } from "../../helpers/sui";

async function main() {
  const amountA = "31308119448.95657";
  const priceLower = "0.00009999008911881024";
  const priceUpper = "9.999997796808161";

  const liquity = computeLiquidity({ amountA, priceLower, priceUpper });

  console.log({ liquity });
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/**
 
bun run src/scripts/sui/computeLiquidity.ts

 */
