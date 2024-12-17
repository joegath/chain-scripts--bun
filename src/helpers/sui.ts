import type { TurbosSdk } from "turbos-clmm-sdk";
import { MAX_TICK_INDEX, MIN_TICK_INDEX } from "turbos-clmm-sdk";
import { BN } from "../lib/bignumber";
import { toSunits, fromSunits } from "../lib/sui";
import { toFixedString } from "../lib/math";

export function tickToPrice(tick: number): number {
  return Math.pow(1.0001, tick);
}

export const computeCreatePoolData = async ({
  sdk,
  coinTypeA,
  coinTypeB,
  priceCurrentInDunits, //price of coinA in terms of coinB
  amountBInDunits,
}: {
  sdk: TurbosSdk;
  coinTypeA: string;
  coinTypeB: string;
  priceCurrentInDunits: string;
  amountBInDunits: string;
}) => {
  const [coinAMetadata, coinBMetadata] = await Promise.all([
    await sdk.coin.getMetadata(coinTypeA),
    await sdk.coin.getMetadata(coinTypeB),
  ]);

  const decimalsA = coinAMetadata.decimals;
  const decimalsB = coinBMetadata.decimals;

  // const decimalsA = 9;
  // const decimalsB = 9;

  /** UNCOMMENT WHEN USING CUSTOM PRICE BOUNDS */

  const priceLowerInDunits = BN.div(priceCurrentInDunits, "10");
  const priceUpperInDunits = BN.mul(priceCurrentInDunits, "10");

  /** UNCOMMENT WHEN USING MIN and MAX PRICE BOUNDS:  */

  // const priceLowerInDunits = sdk.math.tickIndexToPrice(
  //   MIN_TICK_INDEX,
  //   decimalsA,
  //   decimalsB
  // );
  // const priceUpperInDunits = sdk.math.tickIndexToPrice(
  //   MAX_TICK_INDEX,
  //   decimalsA,
  //   decimalsB
  // );

  const amountBInSunits = toSunits(amountBInDunits, {
    decimals: decimalsB.toString(),
  });

  const tickLower = sdk.math.priceToTickIndex(
    priceLowerInDunits,
    decimalsA,
    decimalsB
  );
  const tickUpper = sdk.math.priceToTickIndex(
    priceUpperInDunits,
    decimalsA,
    decimalsB
  );
  const tickCurrent = sdk.math.priceToTickIndex(
    priceCurrentInDunits,
    decimalsA,
    decimalsB
  );

  const priceLower = tickToPrice(tickLower);
  const priceUpper = tickToPrice(tickUpper);
  const priceCurrent = tickToPrice(tickCurrent);

  const liquidity = BN.div(
    amountBInSunits,
    BN.sub(BN.sqrt(priceCurrent.toString()), BN.sqrt(priceLower.toString()))
  );

  const amountAInSunits = toFixedString(
    BN.mulDiv(
      liquidity,
      BN.sub(BN.sqrt(priceUpper.toString()), BN.sqrt(priceCurrent.toString())),
      BN.mul(BN.sqrt(priceCurrent.toString()), BN.sqrt(priceUpper.toString()))
    )
  );

  const amountAInDunits = fromSunits(amountAInSunits, {
    decimals: decimalsA.toString(),
  });

  if (BN.isLessThan(tickLower.toString(), MIN_TICK_INDEX.toString())) {
    throw new Error("tickLower is less than MIN_TICK_INDEX");
  }
  if (BN.isGreaterThan(tickUpper.toString(), MAX_TICK_INDEX.toString())) {
    throw new Error("tickUpper is greater than MAX_TICK_INDEX");
  }

  //To check if it aligns with the set priceCurrent
  const computedPriceCurrent = BN.div(amountBInSunits, amountAInSunits);

  const sqrtPriceCurrent = toFixedString(
    BN.mul(priceCurrent.toString(), BN.pow("2", "64"))
  );

  return {
    priceLowerInDunits,
    priceUpperInDunits,
    priceCurrentInDunits,
    tickLower,
    tickUpper,
    tickCurrent,
    amountAInSunits,
    amountBInSunits,
    amountAInDunits,
    amountBInDunits,
    liquidity,
    computedPriceCurrent,
    sqrtPriceCurrent,
  };
};

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

export const computeLiquidity = ({
  amountA,
  priceLower,
  priceUpper,
}: {
  amountA: string;
  priceLower: string;
  priceUpper: string;
}) => {
  if (
    BN.isLessThanOrEqualTo(priceLower, "0") ||
    BN.isLessThanOrEqualTo(priceUpper, "0")
  ) {
    throw new Error("Price bounds must be positive values.");
  }

  if (BN.isLessThanOrEqualTo(priceUpper, priceLower)) {
    throw new Error("priceUpper must be greater than priceLower.");
  }
  const liquidity = BN.mulDiv(
    amountA,
    BN.mul(priceLower, priceUpper),
    BN.sub(priceUpper, priceLower)
  );

  return liquidity;
};
