import { ipcRenderer } from "electron";
export function showAppMenu() {
  ipcRenderer.send("app:show-app-menu");
}

export function onContextMenuCommand(callback: (e: any, command: any) => void) {
  ipcRenderer.on("app:menu-command", (e, command) => {
    callback(e, command);
  });
}
