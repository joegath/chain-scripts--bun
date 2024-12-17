import type { TurbosSdk } from "turbos-clmm-sdk";
import { MAX_TICK_INDEX, MIN_TICK_INDEX } from "turbos-clmm-sdk";
import { BN } from "../lib/bignumber";
import { toSunits, fromSunits } from "../lib/sui";
import { toFixedString } from "../lib/math";

export function tickToPrice(tick: number): number {
  return Math.pow(1.0001, tick);
}

export type ComputeCreatePoolDataType = {
  sdk: TurbosSdk;
  coinTypeA: string;
  coinTypeB: string;
  priceCurrentInDunits: string;
  useMinMaxTicksPriceRange: boolean;
  amountBInDunits: string;
};

export const computeCreatePoolData = async ({
  sdk,
  coinTypeA,
  coinTypeB,
  priceCurrentInDunits, //price of coinA in terms of coinB
  useMinMaxTicksPriceRange,
  amountBInDunits,
}: ComputeCreatePoolDataType) => {
  const [coinAMetadata, coinBMetadata] = await Promise.all([
    await sdk.coin.getMetadata(coinTypeA),
    await sdk.coin.getMetadata(coinTypeB),
  ]);

  const decimalsA = coinAMetadata.decimals;
  const decimalsB = coinBMetadata.decimals;

  // const decimalsA = 9;
  // const decimalsB = 9;

  let priceLowerInDunits = BN.div(priceCurrentInDunits, "10000");
  let priceUpperInDunits = BN.mul(priceCurrentInDunits, "10000");

  if (useMinMaxTicksPriceRange) {
    priceLowerInDunits = sdk.math
      .tickIndexToPrice(MIN_TICK_INDEX, decimalsA, decimalsB)
      .toString();
    priceUpperInDunits = sdk.math
      .tickIndexToPrice(MAX_TICK_INDEX, decimalsA, decimalsB)
      .toString();
  }

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

  //should be around the set priceCurrent
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
