import BigNumber from "bignumber.js";
import { BN } from "../lib/bignumber";

/**
//TODO
create a string parse function for trimming and joining etc
 */

export const MAX_U64_HEX = "0xFFFFFFFFFFFFFFFF";
export const MAX_U64_INT = "18446744073709551615";

export const A_HUNDRED_BPS = "10000";

/**
 * Checks if a value is undefined
 * @param value
 * @returns boolean
 */
export const checkIsUndefined = (value: unknown) => {
  return typeof value === "undefined";
};

export function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}

export const numberToString = (value: number) => {
  return value.toString();
};

export const bigNumberToString = (value: BigNumber) => {
  return value.toString();
};

export const checkIsPositiveValue = (value: string) => {
  return !BN.isLessThan(value, "0");
};

export const checkIsGreaterThanZero = (value: string) => {
  return BN.isGreaterThan(value, "0");
};

/**
 * Converts a string to lowercase and replaces all empty spaces to dashes:
 * ie: "Hello World" becomes "hello_world"
 * @param stringValue
 * @returns A lowercase string with dash separations
 */
export const toLowerCaseDashSeparated = (stringValue: string) => {
  return stringValue.toLowerCase().split(" ").join("_");
};
export const convertToString = (value: number | BigNumber | bigint) => {
  return value.toString();
};
export const isEmptyObject = (object: object) => {
  return Object.keys(object).length === 0;
};

export const isValidArray = (possibleArray: any) => {
  return Array.isArray(possibleArray);
};

//TODO: Update this func to check empy arrays only;
//should have and array arg, validity if the array should be checkout outside
export const isValidNonEmptyArray = (possibleArray: any) => {
  return isValidArray(possibleArray) && possibleArray.length > 0;
};

export const trimStringsInObject = <T extends Record<string, any>>(
  inputObject: T
): T => {
  const newObject: Record<string, any> = { ...inputObject };
  Object.keys(newObject).forEach((key) => {
    if (typeof newObject[key] === "string") {
      newObject[key] = newObject[key].trim();
    }
  });
  return newObject as T;
};

export const isSameObject = (objOne: object, objTwo: object) => {
  return JSON.stringify(objOne) === JSON.stringify(objTwo);
};

export const removeDuplicatesFromArrayOfObjects = (
  arrayOfObjects: object[],
  options: { targetObjectKey: string }
) => {
  const targetObjectKey = options.targetObjectKey;
  const uniqueArrayOfOjects = arrayOfObjects.filter(
    (obj: { [key: string]: any }, index) => {
      return (
        index ===
        arrayOfObjects.findIndex(
          (o: { [key: string]: any }) =>
            obj[targetObjectKey] === o[targetObjectKey]
        )
      );
    }
  );

  return uniqueArrayOfOjects;
};
/**
 * Retries a function
 * @param param0
 * @returns
 */
export const retryFunctionOnRetriableError = async <T>({
  retriableFunc,
  testIsRetriableError,
  retries = 10, //10 retries
  delay = 2000, //two seconds delay before retry
}: {
  retriableFunc: () => T;
  testIsRetriableError: (error?: unknown) => boolean;
  retries: number;
  delay: number;
}): Promise<T> => {
  try {
    //call retriableFunc and return data if no error
    return await retriableFunc();
  } catch (error) {
    //ascertain if error is retriable by callng testIsRetriableError
    // with error as argument
    const isRetriableError = testIsRetriableError(error);
    if (isRetriableError && retries > 0) {
      console.log(`Retrying... ${retriableFunc}`);
      //delay for some seconds
      await wait(delay);
      //retry function with a reduced retries
      //this will loop so long as there is retriable error and retries still remain
      return await retryFunctionOnRetriableError({
        retriableFunc,
        testIsRetriableError,
        retries: retries - 1, //reduce retries by one
        delay,
      });
    }
    //when error is either not retriable,
    // or has perssited throughout the retrianNum loop, throw error
    throw error;
  }
};

/**
 * This function help prevent state updates when user has dismounted a component.
 * @param {any} promise the promise whose data will be rejected if
 * this function's return cancellation status is cancelled
 * @returns an object comprising of  wrappedpromise and a cancel function
 */

export const cancellablePromise = (promise: any) => {
  const cancellationObj = { isCancelled: false };
  const unmountingRejectionMessage =
    "Cancelled because user unmounted component";
  const newPromise = new Promise(async (res, rej) => {
    try {
      const promiseData = await promise;
      cancellationObj.isCancelled
        ? rej(unmountingRejectionMessage)
        : res(promiseData);
    } catch (e) {
      cancellationObj.isCancelled ? rej(unmountingRejectionMessage) : rej(e);
    }
  });

  return {
    cancellationPromise: newPromise,
    cancelPromise: () => (cancellationObj.isCancelled = true),
  };
};

/**
 * Returns true if the value is null, undefined, or an empty string.
 * @param value - The value to check.
 * @returns True if the value is null, undefined, or an empty string.
 */

export function isNullUndefinedOrEmpty(
  value: unknown
): value is null | undefined | "" {
  return value === null || value === undefined || value === "";
}

export const overrideIfNullUndefinedOrEmpty = <T>(
  currentValue: any,
  overridingValue: T
): T => {
  if (!isNullUndefinedOrEmpty(currentValue)) {
    return currentValue;
  }
  return overridingValue;
};

/**
 * Takes a value and determines if it is null or undefined.
 * If the value is null or undefined, it throws an error with a message that includes
 * the expected value and the value name if they are provided.
 * @param value - The value to check.
 * @param valueName - The name of the value to include in the error message.
 * @param expectedValue - The expected value to include in the error message.
 * @throws {Error} - If the value is null or undefined.
 */
export function throwIfNullOrUndefinedOrEmpty<T>(
  value: T | null | undefined,
  valueName?: string,
  expectedValue?: string
): asserts value is T {
  if (isNullUndefinedOrEmpty(value)) {
    const valueErrorMessage = valueName
      ? `${valueName} is "${value}"`
      : `Value is "${value}"`;
    const expectedValueErrorMessage = expectedValue
      ? `, expected "${expectedValue}"`
      : "";
    throw new Error(`${valueErrorMessage}${expectedValueErrorMessage}`);
  }
}

/**
 * Checks if the input value is a valid number (string, hex value, or number).
 * @param value - The value to check.
 * @returns True if the value is a valid number, false otherwise.
 */
export function checkIsNumber(value: string | number): boolean {
  // Convert the value to a number and check if it is not NaN
  return !isNaN(Number(value));
}

export function checkIsWholeNumber(value: string | number): boolean {
  const numericValue = Number(value);
  return !isNaN(numericValue) && Number.isInteger(numericValue);
}

/**
 * Sorts an array of strings alphabetically.
 *
 * @param values - An array of strings to be sorted.
 * @param options - Optional configuration for sorting order.
 *   - `order`: Specify the sorting order ("ascending" or "descending"). Defaults to "ascending".
 * @returns A new array with the strings sorted according to the specified order.
 * @throws {Error} If an unknown order is provided.
 *
 * @example
 * const fruits = ["banana", "apple", "grape"];
 * const ascendingOrder = sortStringsArray(fruits); // ["apple", "banana", "grape"]
 * const descendingOrder = sortStringsArray(fruits, { order: "descending" }); // ["grape", "banana", "apple"]
 */

export const sortStringsArray = (
  values: string[],
  { order }: { order?: "ascending" | "descending" } = { order: "ascending" }
) => {
  switch (order) {
    case "ascending":
      return values.sort((a, b) => a.localeCompare(b));
    case "descending":
      return values.sort((a, b) => b.localeCompare(a));
    default:
      throw new Error(`Unknown order ${order}`);
  }
};

/**
 * Converts numbers and bigints in an object to strings.
 * Example usage: to convert numbers and bigints in blockchain return objects to strings
 * @param inputObject - The input object whose values need to be converted.
 * @returns A new object with the same keys as the input object, numbers and bigints are converted to strings.
 */

export const stringifyNumberValuesInObject = <T extends Record<string, any>>(
  inputObject: T
): Record<string, any> => {
  const newObject: Record<string, any> = {};

  Object.keys(inputObject).forEach((key) => {
    const value = inputObject[key];
    if (typeof value === "bigint" || typeof value === "number") {
      newObject[key] = value.toString();
    } else {
      newObject[key] = value;
    }
  });

  return newObject;
};

export const sortStringList = (
  objectsList: string[],
  { isSortingValueNumeric }: { isSortingValueNumeric?: boolean } = {}
) => {
  return objectsList.sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: isSortingValueNumeric })
  );
};

export const sortObjectsListUsingStringValue = <T extends Record<string, any>>(
  objectsList: T[],
  {
    keyOfSortingValue,
    isSortingValueNumeric,
  }: { keyOfSortingValue: string; isSortingValueNumeric?: boolean }
): T[] => {
  return objectsList.sort((a, b) =>
    a[keyOfSortingValue].localeCompare(b[keyOfSortingValue], undefined, {
      numeric: isSortingValueNumeric,
    })
  );
};

export const toSnakeCase = (str: string) => {
  return str.trim().toLowerCase().split(" ").join("_").split("-").join("_");
};

/**
 * Initiliazed empty string with a value,
 * used to initialze form data when empty strings cannot be passed
 * defaults to initializing with "0"
 * @param currentValue
 * @param param1
 * @returns string
 */
export const assignIfNullUndefinedOrEmpty = (
  currentValue: string | null | undefined,
  { newValue }: { newValue: string } = { newValue: "0" }
) => {
  if (isNullUndefinedOrEmpty(currentValue)) {
    return newValue;
  }
  return currentValue;
};

export const truncate = (str: string, len: number) => str.slice?.(0, len);

/**
 * Formats a numeric value by truncating its decimal part to the specified precision.
 * @param val The numeric value as a string.
 * @param precision The desired precision (number of decimal places).
 * Useful because big number throw error when value has decimals exceeding 20
 * @returns The formatted value with truncated decimal part.
 */
export const formatMaxPrecision = (val: string, precision = 18): string => {
  const [integerPart, decimalPart] = val.split(".");
  const truncatedDecimalPart = truncate(decimalPart, precision); // Assuming you have a 'truncate' function.
  return integerPart.concat(truncatedDecimalPart);
};

export const createIndexArray = (length: number) => {
  return Array.from({ length }, (_, index) => index);
};
