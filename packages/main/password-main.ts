import { safeStorage, app, ipcMain, BrowserWindow } from "electron";
import path from "path";
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

interface DomainCredential {
  domain: string;
  username: string;
  password: string;
}

interface FileContent {
  version: number;
  credentials: DomainCredential[];
}

function readSavedPasswordFile(): FileContent {
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

function writeSavedPasswordFile(content: FileContent) {
  fs.writeFileSync(
    passwordFilePath,
    safeStorage.encryptString(JSON.stringify(content))
  );
}

function credentialStoreSetPassword(account: DomainCredential) {
  const fileContent = readSavedPasswordFile();

  // delete duplicate credentials
  for (let i = 0; i < fileContent.credentials.length; i++) {
    if (
      fileContent.credentials[i].domain === account.domain &&
      fileContent.credentials[i].username === account.username
    ) {
      fileContent.credentials.splice(i, 1);
      i--;
    }
  }

  fileContent.credentials.push(account);
  writeSavedPasswordFile(fileContent);
}

export default function registerIpcHandlers() {
  ipcMain.handle("password:save", async function (event, account) {
    console.log("password:save");

    return credentialStoreSetPassword(account);
  });

  ipcMain.handle("password:delete", async function (event, account) {
    const fileContent = readSavedPasswordFile();

    // delete matching credentials
    for (let i = 0; i < fileContent.credentials.length; i++) {
      if (
        fileContent.credentials[i].domain === account.domain &&
        fileContent.credentials[i].username === account.username
      ) {
        fileContent.credentials.splice(i, 1);
        i--;
      }
    }

    return writeSavedPasswordFile(fileContent);
  });

  ipcMain.handle("password:get", async function () {
    const credentials = readSavedPasswordFile().credentials;
    console.log(
      "password:get, found items:",
      credentials.map((c) => c.domain)
    );
    return credentials;
  });

  ipcMain.handle("password:autofill-matched", function (event, options) {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("password:autofill-matched");
    const targetView = window
      .getBrowserViews()
      .find((view) => view.webContents.id === options.id);
    if (targetView) {
      targetView.webContents.sendToFrame(
        options.frameId,
        "password:autofill-matched",
        options.data
      );
    }
  });
}
