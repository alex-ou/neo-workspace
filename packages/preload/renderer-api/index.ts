import {
  onReaderModeReady,
  onShowReaderView,
  showReaderView,
} from "./reader-mode-service";
import { contextBridge } from "electron";
import {
  autofillMatched,
  onAutoFill,
  onFormFilled,
  saveCredential,
  deleteCredential,
  getCredentials,
} from "./password-service";

import { initialize } from "./ipc-listeners";
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
    readerModeService: {
      onShowReaderView,
      showReaderView,
      onReaderModeReady,
    },
    application,
  } as NeoNavAPI);
}
