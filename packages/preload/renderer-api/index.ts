import { contextBridge } from "electron";
import { NeoNavAPI } from "./types";
import * as viewAPI from "./view";
import * as windowAPI from "./window";

export function exposeNeoNavAPI() {
  contextBridge.exposeInMainWorld("neonav", {
    view: viewAPI,
    window: windowAPI,
  } as NeoNavAPI);
}
