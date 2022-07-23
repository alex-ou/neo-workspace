import { contextBridge } from "electron";
import { Unity1API } from "./types";
import * as viewAPI from "./view";
import * as windowAPI from "./window";

export function exposeUnity1API() {
  contextBridge.exposeInMainWorld("unity1", {
    view: viewAPI,
    window: windowAPI,
  } as Unity1API);
}
