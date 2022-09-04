import { ipcRenderer } from "electron";
import { subscribe } from "./ipc-listeners";
import { IpcMessageListener } from "./types";

export function showReaderView(viewId: string, theme: string) {
  ipcRenderer.invoke("readermode:show-reader-view", {
    id: viewId,
    theme,
  });
}

export function onShowReaderView(fn: (data: any) => void) {
  ipcRenderer.on("readermode:show-reader-view", (_e, data) => fn(data));
}

export function notifyReaderModeReady() {
  ipcRenderer.send("readermode:notify-ready");
}

export function onReaderModeReady(fn: IpcMessageListener) {
  subscribe("readermode:notify-ready", fn);
}
