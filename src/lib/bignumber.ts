import BigNumber from "bignumber.js";

export const toBn = (value: string) => {
  return new BigNumber(value);
};

export const bnMath = (
  valueOne: string,
  valueTwo: string,
  operation: string
) => {
  let bnVal;
  switch (operation) {
    case "add":
    case "plus":
      bnVal = toBn(valueOne).plus(toBn(valueTwo));
      return bnVal.toFixed();

    case "sub":
    case "minus":
      bnVal = toBn(valueOne).minus(toBn(valueTwo));
      return bnVal.toFixed();

    case "mul":
    case "times":
      bnVal = toBn(valueOne).times(toBn(valueTwo));
      return bnVal.toFixed();

    case "div":
      bnVal = toBn(valueOne).div(toBn(valueTwo));
      return bnVal.toFixed();

    case "pow":
      bnVal = toBn(valueOne).pow(toBn(valueTwo));
      return bnVal.toFixed();

    default:
      throw new Error(
        `bnMath error. Args: (valueOne: ${valueOne}, valueTwo: ${valueTwo}, operation: ${operation})`
      );
  }
};

const bnArraySum = (arr: string[]): string => {
  let BN_Sum = toBn("0");
  let i = 0;
  while (i < arr.length) {
    BN_Sum = BN_Sum.plus(toBn(arr[i]));
    i++;
  }
  return BN_Sum.toFixed();
};

const bnSum = (val1: string | string[], val2?: string): string => {
  if (Array.isArray(val1) && !val2) {
    return bnArraySum(val1);
  } else if (val1 && val2 && typeof val1 === "string") {
    return bnMath(val1, val2, "plus");
  } else {
    throw new Error("bnSum args error");
  }
};

/**
 * get the product of two values and divides with a third value
 * @param {string} val1 number value to multiply
 * @param {string} val2 number value to multiply
 * @param {string} val3 number value to divide with
 * @returns string number value
 */
const bnMulDiv = (val1: string, val2: string, val3: string): string => {
  return toBn(val1).times(toBn(val2)).div(toBn(val3)).toFixed();
};

export const BN = {
  toBN: (val: string) => toBn(val),
  sub: (val1: string, val2: string): string => bnMath(val1, val2, "minus"),
  add: (val1: string | string[], val2?: string): string => bnSum(val1, val2),
  mul: (val1: string, val2: string): string => bnMath(val1, val2, "times"),
  div: (val1: string, val2: string): string => bnMath(val1, val2, "div"),
  mulDiv: (val: string, val2: string, val3: string): string =>
    bnMulDiv(val, val2, val3),
  pow: (val1: string, val2: string): string => bnMath(val1, val2, "pow"),
  sqrt: (val: string) => {
    const bnRes = toBn(val).sqrt();
    return bnRes.toFixed();
  },
  isEqualTo: (val1: string, val2: string): boolean =>
    toBn(val1).isEqualTo(toBn(val2)),
  isGreaterThan: (val1: string, val2: string): boolean =>
    toBn(val1).isGreaterThan(toBn(val2)),
  isGreaterThanOrEqualTo: (val1: string, val2: string): boolean =>
    toBn(val1).isGreaterThanOrEqualTo(toBn(val2)),
  isLessThan: (val1: string, val2: string): boolean =>
    !toBn(val1).isGreaterThanOrEqualTo(toBn(val2)),
  isLessThanOrEqualTo: (val1: string, val2: string): boolean =>
    !toBn(val1).isGreaterThan(toBn(val2)),
};
