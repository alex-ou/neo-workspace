import { BrowserWindow } from "electron";
import {
  DomainCredential,
  readPasswordFile,
  writePasswordFile,
} from "./credential-file";

export const savePassword = async function (
  event: any,
  account: DomainCredential
) {
  const fileContent = readPasswordFile();

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
  writePasswordFile(fileContent);
};

export const deletePassword = async function (
  event: any,
  account: DomainCredential
) {
  const fileContent = readPasswordFile();

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

  return writePasswordFile(fileContent);
};

export const getPassword = async function (
  event: any,
  account: DomainCredential
) {
  const credentials = readPasswordFile().credentials;
  console.log(
    "password:get, found items:",
    credentials.map((c) => c.domain)
  );
  return credentials;
};

export const autofillMatched = async (
  event: Electron.IpcMainInvokeEvent,
  options: any
) => {
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
};
