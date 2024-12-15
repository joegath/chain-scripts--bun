export const GENERIC_ERROR_MESSAGE = "An error occured.";

/**
 * Returns an error obj asserting a value is undefined
 * @param param0//{valueName?: string, value?: any}
 * @returns Error
 */

type UndefinedValueErrorType = {
  valueName?: string;
  value?: any;
};
export const undefinedValueError = ({
  valueName = "value",
  value = "",
}: UndefinedValueErrorType) => {
  return new Error(`${valueName} ${value} is undefined}`);
};
