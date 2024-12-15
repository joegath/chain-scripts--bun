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

export const fromSunits = ({
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

export const toSunits = ({
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

export const shortenEVMAddress = (addr: string) => {
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
