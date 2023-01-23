import { ipcRenderer } from "electron";
import { subscribe } from "./ipc-listeners";
import {
  MatchingCredentials,
  IpcMessageListener,
  DomainCredential,
} from "./types";

export function requestAutofill() {
  ipcRenderer.send("password:autofill");
}

export function onAutoFill(fn: IpcMessageListener) {
  subscribe("password:autofill", fn);
}

export function autofillMatched(options: {
  id: string;
  frameId: string;
  frameUrl: string;
  data: MatchingCredentials;
}) {
  ipcRenderer.invoke("password:autofill-matched", options);
}

export function onAutoFillMatch(fn: (data: MatchingCredentials) => void) {
  ipcRenderer.on("password:autofill-matched", (event, data) => {
    fn(data);
  });
}

export function onFormFilled(fn: IpcMessageListener) {
  subscribe("password:form-filled", fn);
}

export function getCredentials() {
  return ipcRenderer.invoke("password:get");
}

export function saveCredential(options: DomainCredential): Promise<void> {
  return ipcRenderer.invoke("password:save", options);
}

export function deleteCredential(options: {
  domain: string;
  username: string;
}): Promise<void> {
  return ipcRenderer.invoke("password:delete", options);
}

export function formFilled(data: {
  domain: string;
  username: string;
  password: string;
}) {
  ipcRenderer.send("password:form-filled", data);
}
