import { BN } from "../lib/bignumber";

type PoolInfoType = {
  sqrtX96: string;
  pair: string;
  decimal0: string;
  decimal1: string;
};

// Get the two token prices of the pool
// PoolInfo is a dictionary object containing the 4 variables needed
// {"SqrtX96" : slot0.sqrtPriceX96.toString(), "Pair": pairName, "Decimal0": Decimal0, "Decimal1": Decimal1}

export function computeTokenPrices(poolInfo: PoolInfoType) {
  let sqrtPriceX96 = poolInfo.sqrtX96;
  let decimal0 = poolInfo.decimal0;
  let decimal1 = poolInfo.decimal1;

  // Calculate the price of token0 in terms of token1
  const priceOfToken0 = BN.div(
    BN.div(sqrtPriceX96, BN.pow("2", "96")),
    BN.div(BN.pow("10", poolInfo.decimal1), BN.pow("10", poolInfo.decimal0))
  );

  // Calculate the price of token1 in terms of token0
  const priceOfToken1 = BN.div("1", priceOfToken0);

  // Convert to the lowest unit (wei)
  const priceOfToken0Wei = BN.mul(priceOfToken0, BN.pow("10", decimal1));
  const priceOfToken1Wei = BN.mul(priceOfToken1, BN.pow("10", decimal0));

  return {
    priceOfToken0,
    priceOfToken1,
    priceOfToken0Wei,
    priceOfToken1Wei,
  };
}
