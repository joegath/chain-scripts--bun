import { BN } from "turbos-clmm-sdk";
import { NetworksEnum } from "../../lib/sui";
import { turbosSdk } from "../../lib/turbos";

async function main() {
  const network = NetworksEnum.Testnet;
  const sdk = turbosSdk[network];
  const sqrtPriceX64 = "2136964804597609968";

  const price = sdk.math.sqrtPriceX64ToPrice(new BN(sqrtPriceX64), 9, 9);

  console.log({ sqrtPriceX64, price });
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/**
 
bun run src/scripts/sui/computePrice.ts

 */
