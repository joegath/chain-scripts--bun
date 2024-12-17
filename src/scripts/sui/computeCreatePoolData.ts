import {
  computeCreatePoolData,
  computePricesAndAmounts,
} from "../../helpers/sui";
import { NetworksEnum } from "../../lib/sui";
import { turbosSdk } from "../../lib/turbos";

async function main() {
  const network = NetworksEnum.Testnet;
  const sdk = turbosSdk[network];
  const coinTypeA =
    "0x24db9c5d841bcff7649e364d0cdc1e225045d6a1563b8854295e1743fe0454d6::coin::COIN"; // Base token
  const coinTypeB =
    "0xda6ec1c870f2d76639752dfe761704c06f57eacd199c4023a90d0995db663ea2::my_coin::MY_COIN"; // Quote token
  const priceCurrentInDunits = "0.00001";
  const amountBInDunits = "800";

  const data = await computeCreatePoolData({
    sdk,
    coinTypeA,
    coinTypeB,
    priceCurrentInDunits,
    amountBInDunits,
  });

  console.log(data);
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
