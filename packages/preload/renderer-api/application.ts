import { ipcRenderer } from "electron";
export function showAppMenu() {
  ipcRenderer.send("app:show-app-menu");
}

export function onBrowserViewCommand(callback: (e: any, command: any) => void) {
  ipcRenderer.on("app:browser-view-command", (e, command) => {
    callback(e, command);
  });
}
