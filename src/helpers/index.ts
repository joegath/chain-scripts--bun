import { type NetworkType } from "../lib/sui/index";
import {
  isNullUndefinedOrEmpty,
  throwIfNullOrUndefinedOrEmpty,
} from "../utils";
import { checkDirExists, path, readFile, writeDataToFile } from "../lib/fs";
import type {
  SuiObjectChange,
  SuiTransactionBlockResponse,
} from "@mysten/sui/client";

type SuiObjectChangeType =
  | "published"
  | "transferred"
  | "mutated"
  | "deleted"
  | "wrapped"
  | "created";

export const suiObjectChangeNarrowed = <T extends SuiObjectChangeType>(
  type: T
) => {
  return (
    suiObjChange: SuiObjectChange
  ): suiObjChange is Extract<SuiObjectChange, { type: T }> => {
    return suiObjChange.type === type;
  };
};

export const extractPublishedPkg = (res: SuiTransactionBlockResponse) => {
  return res?.objectChanges?.filter(suiObjectChangeNarrowed("published"))[0];
};

export const extractCreatedCoinObjFromTxRes = (
  res: SuiTransactionBlockResponse
) => {
  return res?.objectChanges
    ?.filter(suiObjectChangeNarrowed("created"))
    ?.filter((item) => item?.objectType.includes(`0x2::coin::Coin<`))[0];
};

export const extractCoinTypeFromCoinObjType = (objType: string) => {
  if (!objType.includes("<") || !objType.includes(">")) {
    throw new Error("Invalid object type");
  }
  return objType.split("<")[1].split(">")[0];
};

export const extractCoinTypeFromTxRes = (res: SuiTransactionBlockResponse) => {
  const createdCoinObj = extractCreatedCoinObjFromTxRes(res);
  throwIfNullOrUndefinedOrEmpty(createdCoinObj);
  const coinType = extractCoinTypeFromCoinObjType(createdCoinObj.objectType);
  return coinType;
};

export const extractCreatedPoolObj = (
  res: SuiTransactionBlockResponse,
  options: {
    coinTypeA: string;
    coinTypeB: string;
  }
) => {
  const { coinTypeA, coinTypeB } = options;
  return res?.objectChanges
    ?.filter(suiObjectChangeNarrowed("created"))
    ?.filter((item) =>
      item?.objectType.includes(
        `pool::Pool<${coinTypeA.trim()}, ${coinTypeB.trim()}`
      )
    )[0];
};

export const readDataFromFile = async <T>(filePath: string): Promise<T> => {
  const dirExists = await checkDirExists(filePath);
  if (!dirExists) {
    return {} as T;
  }
  const json = await readFile(filePath);
  if (isNullUndefinedOrEmpty(json)) {
    return {} as T;
  }
  return (await JSON.parse(json)) as T;
};

export const resolveOutputFilePath = ({
  currFilePath,
  network,
}: {
  currFilePath: string;
  network: NetworkType;
}) => {
  const newBasename = path
    .basename(currFilePath, path.extname(currFilePath))
    .concat(`.${network}.json`);
  const outputFilePath = path
    .join(path.dirname(currFilePath), newBasename)
    .replace("/src/", "/dist/");
  return outputFilePath;
};

export const getPublishedCoinFromOutput = async (outputPath: string) => {
  const outputData = await readDataFromFile<SuiTransactionBlockResponse>(
    outputPath
  );
  const createdCoinObj = extractCreatedCoinObjFromTxRes(outputData);
  throwIfNullOrUndefinedOrEmpty(createdCoinObj);
  const coinType = extractCoinTypeFromCoinObjType(createdCoinObj.objectType);
  return coinType;
};

export const writeResData = async ({
  filePath,
  res,
}: {
  filePath: string;
  res: SuiTransactionBlockResponse;
}) => {
  await writeDataToFile({
    filePath,
    data: JSON.stringify(res, null, 2),
  });
};
