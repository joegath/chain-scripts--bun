import { Network, TurbosSdk } from "turbos-clmm-sdk";

export const turbosSdk = {
  mainnet: new TurbosSdk(Network.mainnet),
  testnet: new TurbosSdk(Network.testnet),
};
