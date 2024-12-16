export function tickToPrice(tick: number): number {
  return Math.pow(1.0001, tick);
}

export function computePricesAndAmounts(
  tickLower: number,
  tickUpper: number,
  tickCurrent: number,
  liquidity: number
) {
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

  return { priceLower, priceUpper, priceCurrent, amount0, amount1 };
}
