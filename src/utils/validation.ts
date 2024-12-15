export const HTML_TAGS_NOT_ALLOWED_MSG = "HTML tags not allowed";

export const validationMessages = {
  shouldBeNumber: "Should be a number",
  shouldNotBeNegative: "Should not be negative",
  shouldBeGreaterThanZero: "Should be greater than zero",
  shouldNotExceedMaxUint256: "should not exceed max UINT256",
  shouldNotContainHtmlTags: "Should not contain HTML tags",
  shouldBeInTheFuture: "Should be in the future",
  invalidAddress: "Invalid address",
  shouldNotBeAddressZero: "Should not be address zero",
  shouldBeGreaterThan: (value: string) => `Should be greater than ${value}`,
  shouldBeLessThan: (value: string) => `Should not exceed ${value}`,
  shouldNotBeGreaterThan: (value: string) =>
    `Should not be greater than ${value}`,
  shouldNotBeLessThan: (value: string) => `Should not be less than ${value}`,
};
/**
 * removes all HTML tags in an input
 * used to sanitize user inputs to prevent prevent
 * security vulnerabilities such as SQL injection, XSS etc
 * @param input
 * @returns sanitized input
 */
export const removeHTMLTags = (input: string) => {
  return input.replace(/<\/?[^>]+(>|$)/g, "");
};

export const containsHTMLTags = (input: string) => {
  const newString = removeHTMLTags(input);
  return newString.length !== input.length;
};

/**
 * Sanitizes the string values in an input object by triming whitespaces and removing HTML tags.
 * @param inputObject - The input object with string values to sanitize.
 * @returns A new object with sanitized string values.
 */
export const sanitizeStringsInObject = <T extends Record<string, any>>(
  inputObject: T
): T => {
  const newObject: Record<string, any> = { ...inputObject };
  Object.keys(newObject).forEach((key) => {
    if (typeof newObject[key] === "string") {
      newObject[key] = removeHTMLTags(newObject[key].trim());
    }
  });
  return newObject as T;
};

export const isTooLong = (input: string, maxLength: number) => {
  return input.trim().length > maxLength;
};

export function isValidEmail(email: string): boolean {
  const emailRegex: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}
