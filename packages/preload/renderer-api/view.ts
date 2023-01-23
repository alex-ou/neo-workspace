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

export async function hideView(viewId: string): Promise<void> {
  await ipcRenderer.invoke("view:hide", {
    id: viewId,
  });
}

export async function showView(viewId: string): Promise<void> {
  await ipcRenderer.invoke("view:show", {
    id: viewId,
  });
}
export async function focusView(viewId: string): Promise<void> {
  await ipcRenderer.invoke("view:focus", {
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

export async function reload(viewId: string): Promise<void> {
  return await ipcRenderer.invoke("view:reload", {
    id: viewId,
  });
}
export async function stop(viewId: string): Promise<void> {
  return await ipcRenderer.invoke("view:stop", {
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

export async function onUpdate(
  callback: (info: ViewInfo) => void
): Promise<void> {
  ipcRenderer.removeAllListeners("view:did-update");
  ipcRenderer.on("view:did-update", (event, info) => {
    callback(info);
  });
}
