import Web3 from "web3";
import { BN } from "./bignumber";
import { convertToString } from "../utils";

/**=================CONSTANTS ================================= */

export const MAX_UINT256_HEX =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

export const MAX_UINT256_INT =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const ADDRESS_PLACEHOLDER = "0xeafEdf63D9bdD...";

/**=================FUNCTIONS ================================= */

export const getWeb3 = (provider: any) => {
  return new Web3(provider);
};

export const checkIsAddress = ({
  address,
  web3,
}: {
  address: string;
  web3: any;
}): boolean => {
  return web3.utils.isAddress(address);
};

export const toChecksumAddress = ({
  address,
  web3,
}: {
  address: string;
  web3: any;
}): string => {
  return web3.utils.toChecksumAddress(address);
};

export const checkIsSameAddress = ({
  addressOne,
  addressTwo,
  web3,
}: {
  addressOne: string;
  addressTwo: string;
  web3: any;
}) => {
  return (
    toChecksumAddress({ address: addressOne, web3 }) ===
    toChecksumAddress({ address: addressTwo, web3 })
  );
};

export const getAddressEthBalance = async ({
  address,
  web3,
}: {
  address: string;
  web3: any;
}) => {
  return convertToString(await web3.eth.getBalance(address));
};

export const fromWei = ({
  value,
  decimals,
  web3,
}: {
  value: string;
  decimals: string;
  web3: any;
}): string => {
  if (decimals === "18") {
    return web3.utils.fromWei(value, "ether");
  } else {
    return BN.div(value, BN.pow("10", decimals));
  }
};

export const toWei = ({
  value,
  decimals,
  web3,
}: {
  value: string;
  decimals: string;
  web3: any;
}): string => {
  if (decimals === "18") {
    return web3.utils.toWei(value, "ether");
  } else {
    return BN.mul(value, BN.pow("10", decimals));
  }
};

export const shortenedEVMAddress = (addr: string) => {
  return (
    addr[0] +
    addr[1] +
    addr[2] +
    addr[3] +
    addr[4] +
    "..." +
    addr[38] +
    addr[39] +
    addr[40] +
    addr[41]
  );
};

export const getConnectWalletMessage = (expectedNetworkName: string) => {
  return `Please connect wallet and set network to ${expectedNetworkName}`;
};

export const getConnectWalletToCorrectNetworkMessage = ({
  currentConnectedNetwork,
  expectedNetworkName,
}: {
  currentConnectedNetwork: string;
  expectedNetworkName: string;
}) => {
  return `Connected wallet is currently set to ${currentConnectedNetwork}. First change the network to ${expectedNetworkName} and call the action again`;
};

/**=================ERRORS ================================= */

export const web3ErrorTypes = {
  web3Connection: {
    message: "Web3 not connected",
    feedback: "Not connected. Please connect wallet.",
  },
  invalidReturns: {
    message:
      "Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using",
    feedback: "Returned values aren't valid",
  },
  invalidAddress: {
    message: "Invalid Address",
    feedback: "Invalid Address",
  },
  jsonRpcEngine: {
    message: "Response has no error or result for request",
    feedback: "Error: could not get result",
  },
  gas: {
    message: "[ethjs-query] while formatting outputs from RPC",
    feedback: "RPC or wallet settings error",
  },
  generic: {
    feedback: "An error occured.",
  },
};

export const INVALID_RETURN_VALUES_ERROR_MSG =
  "Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI";

export const isInternalRpcError = (error: any) => {
  return (
    error?.message.includes(
      "JsonRpcEngine: Response has no error or result for request"
    ) ||
    error?.message.includes("Couldn't connect to node") ||
    error?.message.includes("Returned error: handle request error") ||
    error?.message.includes("Internal JSON-RPC error")
  );
};

export const RETRIALABLE_ERRORS_MSGS = ["8u8ue882u82cbchbdce"];

export const testIsRetriableError = (error: unknown) => {
  if (typeof error === "string") {
    return error.includes(RETRIALABLE_ERRORS_MSGS[0]);
  }
  return (error as Error)?.message.includes(RETRIALABLE_ERRORS_MSGS[0]);
};

export const retriableErrorConfigs = {
  retries: 20,
  delay: 1000,
};

export const IGNORABLE_ERRORS = [
  "Connection request reset. Please try again.", //Wallet connect error that occurs when user closes walletconnects modal
];

export const checkIsIgnorableError = (error: any) => {
  return IGNORABLE_ERRORS.includes((error as Error).message);
};
