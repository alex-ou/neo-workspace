import { contextBridge } from "electron";
import {
  autofillMatched,
  initialize,
  onAutoFill,
  onFormFilled,
  saveCredential,
  deleteCredential,
  getCredentials,
} from "./password-service";
import { NeoNavAPI } from "./types";
import * as viewAPI from "./view";
import * as windowAPI from "./window";
import * as application from "./application";

export function exposeNeoNavAPI() {
  initialize();

  contextBridge.exposeInMainWorld("neonav", {
    view: viewAPI,
    window: windowAPI,
    passwordService: {
      onAutoFill,
      autofillMatched,
      onFormFilled,
      saveCredential,
      deleteCredential,
      getCredentials,
    },
    application,
  } as NeoNavAPI);
}
