import { BN } from "./bignumber";
import { MAX_UINT256_INT } from "./web3";

export const checkIsNumber = (value: any) => {
  if (!(typeof value !== "string" || typeof value !== "number")) {
    return false;
  }
  const toNumber = Number(value);
  if (toNumber === null) {
    return false;
  }
  return true;
};

export const roundOffNumber = (value: number, decimals: number) => {
  return parseFloat(value.toString()).toFixed(decimals);
};

export const roundOffString = (value: string, decimals: number) => {
  return roundOffNumber(Number(value), decimals);
};

export const checkExceedsMaxUINT256 = (value: string) => {
  return BN.isGreaterThan(value, MAX_UINT256_INT);
};

export const numberToHexString = (value: number | string): string => {
  return `0x${Number(value).toString(16)}`;
};

/**
 * Converts hex string to decimal number
 * @param {string} hex
 * @returns decimal number
 */
export const hexToNumber = (hex: string): number => {
  if (!checkIsNumber(hex)) {
    throw new Error(`Expected a Hex string but got "${hex}"`);
  }
  return parseInt(hex.toString(), 16);
};

/**
 * converts percentages number to bips
 * in order to increase presicion and allow usage of decimals up to 0.01%
 * @param {string} value string value of a number to be converted
 * @returns a string of a multiple os 100 of the value passed
 */
export const toBps = (value: string) => {
  return (parseFloat(value) * 100).toString();
};

export const fromBps = (value: string) => {
  return (parseFloat(value) / 100).toString();
};

export const toFixedString = (val: any) => {
  if (!checkIsNumber(val)) {
    throw new Error(`${val} is not a number`);
  }
  return val.toString().split(".")[0];
};
