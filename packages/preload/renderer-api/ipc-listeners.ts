import { ipcRenderer } from "electron";
import { IpcMessageListener } from "./types";

export interface ListenerInfo {
  name: string;
  fn: IpcMessageListener;
}

const ipcMessageListeners: ListenerInfo[] = [];

export function subscribe(name: string, fn: IpcMessageListener) {
  ipcMessageListeners.push({ name, fn });
}

export function initialize() {
  const isMainWindow = process.argv.includes("--main-window");
  if (isMainWindow) {
    ipcRenderer.on("view:ipc-message", (event, args) => {
      console.log("view:ipc-message", args);
      ipcMessageListeners.forEach((item) => {
        if (item.name === args.name) {
          item.fn(args.id, args.data, args.frameId, args.frameURL);
        }
      });
    });
  }
}
