import { ViewInfo } from "./types";
import { ipcRenderer } from "electron";

export async function hideAllViews(): Promise<void> {
  return await ipcRenderer.invoke("view:hide-all");
}

export async function showAllViews(): Promise<void> {
  return await ipcRenderer.invoke("view:show-all");
}

export async function destroyView(viewId: string): Promise<void> {
  await ipcRenderer.invoke("view:destroy", {
    id: viewId,
  });
}

export async function goBack(viewId: string): Promise<void> {
  await ipcRenderer.invoke("view:go-back", {
    id: viewId,
  });
}

export async function goForward(viewId: string): Promise<void> {
  await ipcRenderer.invoke("view:go-forward", {
    id: viewId,
  });
}

export async function createView(options: {
  url: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}): Promise<string> {
  return await ipcRenderer.invoke("view:create", options);
}

export async function setViewBounds(options: {
  id: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}): Promise<void> {
  return await ipcRenderer.invoke("view:update", options);
}

export async function loadViewUrl(options: {
  id: string;
  url: string;
}): Promise<void> {
  return await ipcRenderer.invoke("view:update", options);
}

export async function onNavigate(
  callback: (info: ViewInfo) => void
): Promise<void> {
  ipcRenderer.removeAllListeners("view-did-navigate");
  ipcRenderer.on("view-did-navigate", (event, info) => {
    callback(info);
  });
}
