import { computeCreatePoolData } from "../../../helpers/sui";
import { NetworkEnum } from "../../../lib/sui";
import { turbosSdk } from "../../../lib/turbos";

async function main() {
  const network = NetworkEnum.Testnet;

  // Data and configs
  const args = {
    sdk: turbosSdk[network],
    coinTypeA:
      "0x24db9c5d841bcff7649e364d0cdc1e225045d6a1563b8854295e1743fe0454d6::coin::COIN", // Base token
    coinTypeB:
      "0xda6ec1c870f2d76639752dfe761704c06f57eacd199c4023a90d0995db663ea2::my_coin::MY_COIN", // Quote token
    priceCurrentInDunits: "0.0001",
    useMinMaxTicksPriceRange: true,
    amountBInDunits: "1600",
  };

  const data = await computeCreatePoolData(args);
  console.log("Full data", data);

  const poolData = {
    tickLower: data.tickLower,
    tickUpper: data.tickUpper,
    amountAInSunits: data.amountAInSunits,
    amountBInSunits: data.amountBInSunits,
    sqrtPriceCurrent: data.sqrtPriceCurrent,
  };
  console.log("Pool data", poolData);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/**
 
bun run src/scripts/sui/computeCreatePoolData.ts

 */
