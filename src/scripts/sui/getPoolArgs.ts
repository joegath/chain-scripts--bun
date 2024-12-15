function tickToPrice(tick: number): number {
  return Math.pow(1.0001, tick);
}

function computeAmounts(
  tickLower: number,
  tickUpper: number,
  tickCurrent: number,
  liquidity: number
): { amount0: number; amount1: number } {
  const priceLower = tickToPrice(tickLower);
  const priceUpper = tickToPrice(tickUpper);
  const priceCurrent = tickToPrice(tickCurrent);

  let amount0 = 0;
  let amount1 = 0;

  if (priceCurrent <= priceLower) {
    // Current price below range
    amount0 =
      (liquidity * (Math.sqrt(priceUpper) - Math.sqrt(priceLower))) /
      (Math.sqrt(priceLower) * Math.sqrt(priceUpper));
    amount1 = 0;
  } else if (priceCurrent >= priceUpper) {
    // Current price above range
    amount0 = 0;
    amount1 = liquidity * (Math.sqrt(priceUpper) - Math.sqrt(priceLower));
  } else {
    // Current price within range
    amount0 =
      (liquidity * (Math.sqrt(priceUpper) - Math.sqrt(priceCurrent))) /
      (Math.sqrt(priceCurrent) * Math.sqrt(priceUpper));
    amount1 = liquidity * (Math.sqrt(priceCurrent) - Math.sqrt(priceLower));
  }
  console.log({
    priceLower,
    priceUpper,
    priceCurrent,
  });

  return { amount0, amount1 };
}

async function main() {
  // Example:
  const tickLower = -40000;
  const tickUpper = 40000;
  const tickCurrent = 0;
  const liquidity = 10000;

  const { amount0, amount1 } = computeAmounts(
    tickLower,
    tickUpper,
    tickCurrent,
    liquidity
  );
  console.log({
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
