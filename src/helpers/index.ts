import { type NetworkType } from "../lib/sui/index";
import {
  isNullUndefinedOrEmpty,
  throwIfNullOrUndefinedOrEmpty,
} from "../utils";
import { checkDirExists, path, readFile, writeDataToFile } from "../lib/fs";
import type {
  SuiObjectChange,
  SuiObjectResponse,
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
    suiObjectChange: SuiObjectChange
  ): suiObjectChange is Extract<SuiObjectChange, { type: T }> => {
    return suiObjectChange.type === type;
  };
};

export const extractMoveObjectFields = (res: SuiObjectResponse) => {
  const dataType = res?.data?.content?.dataType;
  if (dataType !== "moveObject")
    throw new Error(`Expected moveObject, got ${dataType}`);
  return res?.data?.content?.fields;
};

export const extractPackageBytecode = (res: SuiObjectResponse) => {
  const dataType = res?.data?.content?.dataType;
  if (dataType !== "package")
    throw new Error(`Expected package, got ${dataType}`);
  return res?.data?.content?.disassembled;
};

export const extractPublishedPackage = (res: SuiTransactionBlockResponse) => {
  return res?.objectChanges?.filter(suiObjectChangeNarrowed("published"))[0];
};

export const extractCreatedCoinObject = (res: SuiTransactionBlockResponse) => {
  return res?.objectChanges
    ?.filter(suiObjectChangeNarrowed("created"))
    ?.filter((item) => item?.objectType.includes(`0x2::coin::Coin<`))[0];
};

export const extractCoinTypeFromCoinObjectType = (objType: string) => {
  if (!objType.includes("<") || !objType.includes(">")) {
    throw new Error("Invalid object type");
  }
  return objType.split("<")[1].split(">")[0];
};

export const extractCoinTypeFromTransactionResponse = (
  res: SuiTransactionBlockResponse
) => {
  const createdCoinObj = extractCreatedCoinObject(res);
  throwIfNullOrUndefinedOrEmpty(createdCoinObj);
  const coinType = extractCoinTypeFromCoinObjectType(createdCoinObj.objectType);
  return coinType;
};

export const extractCreatedPoolObject = (
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
  const createdCoinObj = extractCreatedCoinObject(outputData);
  throwIfNullOrUndefinedOrEmpty(createdCoinObj);
  const coinType = extractCoinTypeFromCoinObjectType(createdCoinObj.objectType);
  return coinType;
};

export const recordResponse = async ({
  filePath,
  response,
}: {
  filePath: string;
  response: SuiTransactionBlockResponse;
}) => {
  await writeDataToFile({
    filePath,
    data: JSON.stringify(response, null, 2),
  });
};
