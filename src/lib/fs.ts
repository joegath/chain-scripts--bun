import * as fsApi from "fs/promises";
import * as pathApi from "path";

export const fs = fsApi;
export const path = pathApi;

export const checkDirExists = async (dirPath: string) => {
  try {
    await fs.access(dirPath);
    return true;
  } catch {
    return false;
  }
};

export const createDir = async (dirPath: string) => {
  await fs.mkdir(dirPath, { recursive: true });
};

export const ensureDirExists = async (dirPath: string) => {
  const dirExists = await checkDirExists(dirPath);
  if (!dirExists) {
    await createDir(dirPath);
  }
};

export const writeDataToFile = async ({
  filePath,
  data,
}: {
  filePath: string;
  data: string;
}) => {
  ensureDirExists(filePath);
  await fs.writeFile(filePath, data);
};

export const readFile = async (filePath: string) => {
  const data = await fs.readFile(filePath, { encoding: "utf8" });
  return data;
};
