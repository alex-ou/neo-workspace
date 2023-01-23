import { ipcMain, BrowserWindow, nativeTheme } from "electron";

export function registerWindowIpcHandler() {
  ipcMain.handle("window:focus", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("window:focus");
    window.webContents.focus();
  });

  ipcMain.handle("window:maximize", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("window:maximize", viewData);
    window.maximize();
  });

  ipcMain.handle("window:minimize", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("window:minimize", viewData);
    window.minimize();
  });

  ipcMain.handle("window:close", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("window:close", viewData);
    window.close();
  });

  ipcMain.handle("window:unmaximize", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("window:unmaximize", viewData);
    window.setFullScreen(false);
    window.unmaximize();
  });

  ipcMain.handle("window:get-state", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    const state = {
      isFullscreen: window.isFullScreen(),
      isMaximized: window.isMaximized(),
      isMinimized: window.isMinimized(),
    };
    console.log("window:get-state", state);
    return state;
  });

  ipcMain.handle("window:set-theme", (event, viewData) => {
    const { theme } = viewData;
    const window = BrowserWindow.fromWebContents(event.sender)!;
    nativeTheme.themeSource = theme;
    const overlayOptions =
      theme === "dark"
        ? { color: "#252a31", symbolColor: "#f6f7f9", height: 29 }
        : { color: "#fff", symbolColor: "#1c2127", height: 29 };
    window.setTitleBarOverlay(overlayOptions);
  });
}
