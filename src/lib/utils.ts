import { v4 } from "uuid";
import * as z from "zod";

export const uuidV4 = () => {
  return v4();
};

export const createImageFilePath = (fileName: string) => {
  //appends fileName to an auto-generated UUID
  return `images/${fileName + "_" + uuidV4()}`;
};

/**
 * Extracts Zod validation errors from a SafeParseReturnType.
 * This function takes a z.SafeParseReturnType as input and extracts
 *  any validation errors encountered during parsing
 * The resulting array contains error objects with field names,
 *  error types (always “manual” in this case), and corresponding error messages.
 * @template T - The type of the expected data structure.
 * @template U - The type of the error data structure.
 * @param {z.SafeParseReturnType<T, U>} zodRes - The result of parsing with Zod.
 * @returns {Array<{
 *   name: keyof T;
 *   type: "manual";
 *   message: string;
 * }>} - An array of error objects containing field names, error type, and error messages.
 */

export const extractZodErrors = <T, U>(zodRes: z.SafeParseReturnType<T, U>) => {
  const errors = [] as {
    name: keyof U;
    type: "manual";
    message: string;
  }[];

  if (!zodRes.success) {
    const fieldErrors = zodRes.error.flatten().fieldErrors;
    for (const fieldName in fieldErrors) {
      const errorMessages = fieldErrors[fieldName as keyof typeof fieldErrors];
      if (errorMessages) {
        errors.push({
          name: fieldName as keyof U,
          type: "manual",
          message: errorMessages[0],
        });
      }
    }
  }

  return errors;
};
