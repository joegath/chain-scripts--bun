import { computeTokenPrices as computeTokenPrices } from "../../helpers/evm";

async function main() {
  // Example: WETH/USDC pool with a 0.05% fee tier
  const { priceOfToken0, priceOfToken1, priceOfToken0Wei, priceOfToken1Wei } =
    computeTokenPrices({
      sqrtX96: "79228162514264337593543950336", // price of 1
      pair: "WETH/USDC",
      decimal0: "18",
      decimal1: "6",
    });

  console.log({
    priceOfToken0,
    priceOfToken1,
    priceOfToken0Wei,
    priceOfToken1Wei,
  });
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/**
 
bun run src/scripts/evm/getPriceFromTicks.ts

 */
