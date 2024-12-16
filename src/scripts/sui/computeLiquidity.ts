import { NetworksEnum } from "../../lib/sui";
import { turbosSdk } from "../../lib/turbos";

async function main() {
  const network = NetworksEnum.Testnet;
  const sdk = turbosSdk[network];
  const amount0 = "400";
  const priceLower = "0.01";
  const priceUpper = "50";

  // const liq = sdk.pool.getFixedLiquidity;
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/**
 
bun run src/scripts/sui/getPoolArgs.ts

 */
