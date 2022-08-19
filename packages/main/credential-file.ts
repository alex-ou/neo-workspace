import path from "path";
import { app, safeStorage } from "electron";
import fs from "fs";

const userDataPath = app.getPath("userData");
const passwordFilePath = path.join(userDataPath, "passwordStore");

/*
file format:
{
  version: 1,
  credentials: [
    {
      domain:,
      username:,
      password:
    }
  ]
}
*/
export interface DomainCredential {
  domain: string;
  username: string;
  password: string;
}

export interface FileContent {
  version: number;
  credentials: DomainCredential[];
}

export function readPasswordFile(): FileContent {
  let file;
  try {
    file = fs.readFileSync(passwordFilePath);
  } catch (e: any) {
    if (e.code !== "ENOENT") {
      console.warn(e);
      throw new Error(e);
    }
  }
  if (file) {
    return JSON.parse(safeStorage.decryptString(file));
  } else {
    return {
      version: 1,
      credentials: [],
    };
  }
}

export function writePasswordFile(content: FileContent) {
  fs.writeFileSync(
    passwordFilePath,
    safeStorage.encryptString(JSON.stringify(content))
  );
}
