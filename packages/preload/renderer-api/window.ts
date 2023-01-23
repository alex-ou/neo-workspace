import { WindowState } from "./types";
import { ipcRenderer } from "electron";

export async function focus(): Promise<void> {
  return await ipcRenderer.invoke("window:focus");
}

export async function maximize(): Promise<void> {
  return await ipcRenderer.invoke("window:maximize");
}

export async function unmaximize(): Promise<void> {
  return await ipcRenderer.invoke("window:unmaximize");
}

export async function minimize(): Promise<void> {
  return await ipcRenderer.invoke("window:minimize");
}

export async function close(): Promise<void> {
  return await ipcRenderer.invoke("window:close");
}

export async function getState(): Promise<WindowState> {
  return await ipcRenderer.invoke("window:get-state");
}

export async function setTheme(options: { theme: string }): Promise<void> {
  return await ipcRenderer.invoke("window:set-theme", options);
}
