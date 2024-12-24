import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { throwIfNullOrUndefinedOrEmpty } from "../../utils";
import { BN } from "../bignumber";

export type NetworkType = "mainnet" | "testnet" | "devnet" | "localnet";

export enum NetworkEnum {
  Mainnet = "mainnet",
  Testnet = "testnet",
  Devnet = "devnet",
  Localnet = "localnet",
}

export enum Urls {
  Mainnet = "https://fullnode.mainnet.sui.io:443",
  Testnet = "https://fullnode.testnet.sui.io:443",
  Devnet = "https://fullnode.devnet.sui.io:443",
  Localnet = "http://127.0.0.1:9000",
}

export const SUI_COIN_TYPE = "0x2::sui::SUI";
export const CLOCK_ID = "0x6";

export const getClient = (network: NetworkType = "mainnet") => {
  const rpcUrl = getFullnodeUrl(network); // Use "testnet" or "mainnet" as needed
  const client = new SuiClient({ url: rpcUrl });
  return client;
};

export const callGetCoins = async (
  owner: string,
  options?: { network?: NetworkType; coinType?: string | null }
) => {
  const coinType = options?.coinType ?? SUI_COIN_TYPE;
  const client = getClient(options?.network);

  // Fetch all SUI coin objects owned by the address
  const coins = await client.getCoins({
    owner,
    coinType,
  });
  return coins;
};
export const getCoinBalance = async (
  owner: string,
  options?: { network?: NetworkType; coinType?: string | null }
) => {
  const coinsResponse = await callGetCoins(owner, options);

  // Sum up the balances of all the SUI coin objects
  const totalBalance = coinsResponse.data.reduce((sum, coin) => {
    return sum + BigInt(coin.balance); // Use BigInt to safely handle large numbers
  }, BigInt(0));

  return totalBalance.toString(); // Return as a string for easier display
};

export const getSuiBalance = async (address: string) => {
  return await getCoinBalance(address, {
    network: NetworkEnum.Mainnet,
    coinType: SUI_COIN_TYPE,
  });
};

export const getCoinMetadata = async ({
  client,
  coinType,
}: {
  client: SuiClient;
  coinType: string;
}) => {
  const metadata = await client.getCoinMetadata({
    coinType,
  });
  throwIfNullOrUndefinedOrEmpty(metadata);
  return metadata;
};

export const getCoinDecimals = async ({
  client,
  coinType,
}: {
  client: SuiClient;
  coinType: string;
}) => {
  return (await getCoinMetadata({ client, coinType })).decimals.toString();
};

export const shortenedSuiAddress = (addr: string) => {
  return (
    addr[0] +
    addr[1] +
    addr[2] +
    addr[3] +
    addr[4] +
    addr[5] +
    "..." +
    addr[62] +
    addr[63] +
    addr[64] +
    addr[65]
  );
};

export const toSunits = (
  value: string,
  options: { decimals: string } = { decimals: "9" }
): string => {
  return BN.mul(value, BN.pow("10", options.decimals));
};

export const fromSunits = (
  value: string,
  options: { decimals: string } = { decimals: "9" }
): string => {
  return BN.div(value, BN.pow("10", options.decimals));
};
