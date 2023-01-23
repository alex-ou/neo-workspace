import path from "path";
import fs from "fs";
import { BrowserWindow, ipcMain, nativeTheme } from "electron";

let cssFile: string;

export const onShowReaderView = async (
  event: Electron.IpcMainInvokeEvent,
  options: { id: number; theme: string }
) => {
  const window = BrowserWindow.fromWebContents(event.sender)!;
  console.log(
    "readermode:show-reader-view",
    path.join(__dirname, "./assets/reader-mode.css")
  );
  const targetView = window
    .getBrowserViews()
    .find((view) => view.webContents.id === options.id);
  if (targetView) {
    if (!cssFile) {
      try {
        cssFile = fs.readFileSync(
          path.join(__dirname, "./assets/reader-mode.css"),
          "utf8"
        );
      } catch (e: any) {
        if (e.code !== "ENOENT") {
          console.warn(e);
        }
      }
    }
    targetView.webContents.send("readermode:show-reader-view", {
      style: cssFile,
      theme: options.theme || nativeTheme.themeSource,
    });
  }
};

export function registerReaderModeIpcHandler() {
  ipcMain.handle("readermode:show-reader-view", onShowReaderView);
}
