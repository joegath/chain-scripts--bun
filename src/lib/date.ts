import { BN } from "./bignumber";

/**
 *
 * @returns currenct date and time
 * in this format: Sun Apr 09 2023 15:40:23 GMT+0300 (East Africa Time)
 */
export const getCurrentDate = (): Date => {
  return new Date();
};

/**
 *
 * @returns number epoch time in milliseconds
 */
export const getCurrentTimeInMs = () => {
  return getCurrentDate().getTime().toString();
};

export const getCurrentTimeInSecs = () => {
  const epochTimeMillSecs = getCurrentTimeInMs();
  return BN.div(epochTimeMillSecs, "1000");
};

/**
 * Converts Date object to epoch time
 * @param {*} dateObject date object
 * @returns a string of milliseconds
 */
export const convertDateToMs = (dateObject: Date) => {
  return Date.parse(dateObject.toString()).toString();
};

export const convertDateToEpochSecs = (dateObject: Date) => {
  const milliseconds = convertDateToMs(dateObject);
  return BN.div(milliseconds, "1000");
};

export const convertSecsToDate = (epochSecs: string) => {
  return new Date(parseInt(epochSecs) * 1000);
};

//To update to this method
export const convertSecsToDateString = (epochSecs: string) => {
  return convertSecsToDate(epochSecs).toString();
};

export const convertSecsToUTCString = (epochSecs: string) => {
  return `${convertSecsToDate(epochSecs).toUTCString()}(UTC)`;
};

export type DurationNameType = "DAYS" | "HOURS" | "MINUTES" | "MILLISECONDS";
export const getDurationFromSeconds = ({
  seconds,
  durationName,
  precision = 2,
}: {
  seconds: string;
  durationName: DurationNameType;
  precision?: number;
}) => {
  switch (durationName) {
    case "DAYS":
      return (parseFloat(seconds) / (60 * 60 * 24)).toFixed(precision);

    case "HOURS":
      return (parseFloat(seconds) / (60 * 60)).toFixed(precision);

    case "MINUTES":
      return (parseFloat(seconds) / 60).toFixed(precision);

    case "MILLISECONDS":
      return (parseFloat(seconds) * 1000).toFixed();

    default:
      throw new Error(
        `getDurationFromSeconds error: args: (${seconds}, ${durationName}, ${precision})`
      );
  }
};
