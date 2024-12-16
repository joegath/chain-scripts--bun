import { computePricesAndAmounts as computePricesAndAmounts } from "../../helpers/sui";

async function main() {
  // Example:
  const tickLower = -40000;
  const tickUpper = 40000;
  const tickCurrent = 0;
  const liquidity = 10000;

  const { priceLower, priceUpper, priceCurrent, amount0, amount1 } =
    computePricesAndAmounts(tickLower, tickUpper, tickCurrent, liquidity);
  console.log({
    priceLower,
    priceUpper,
    priceCurrent,
    amount0,
    amount1,
  });
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
