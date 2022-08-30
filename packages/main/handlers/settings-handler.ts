import { ipcMain } from "electron";
import { setSettings } from "../settings";

export function registerSettingsIpcHandler() {
  ipcMain.on("app:update-settings", (event, settings) => {
    setSettings(settings);
  });
}
