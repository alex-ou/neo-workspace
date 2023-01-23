import { ipcRenderer } from "electron";
export function showAppMenu() {
  ipcRenderer.send("app:show-app-menu");
}
export function updateSettings(settings: { [key: string]: any }) {
  ipcRenderer.send("app:update-settings", settings);
}
export function onBrowserViewCommand(callback: (e: any, command: any) => void) {
  ipcRenderer.on("app:browser-view-command", (e, command) => {
    callback(e, command);
  });
}
