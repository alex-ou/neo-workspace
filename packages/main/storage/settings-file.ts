import path from "path";
import { app, safeStorage } from "electron";
import fs from "fs";

const userDataPath = app.getPath("userData");
const settingsFilePath = path.join(userDataPath, "settingsStore");

/*
file format:
{"passwordNeverSaveDomains":[],"searchEngine":"DuckDuckGo","isBlockingAds":false}
*/

export interface SettingsContent {
  passwordNeverSaveDomains: string[];
  searchEngine: string;
  isBlockingAds: boolean;
}

export function readSettingsFile(): SettingsContent {
  let file;
  try {
    file = fs.readFileSync(settingsFilePath);
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
      passwordNeverSaveDomains: [],
      searchEngine: "Google",
      isBlockingAds: true,
    };
  }
}

export function writeSettingsFile(content: SettingsContent) {
  fs.writeFileSync(
    settingsFilePath,
    safeStorage.encryptString(JSON.stringify(content))
  );
}
