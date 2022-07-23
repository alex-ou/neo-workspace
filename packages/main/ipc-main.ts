import { ipcMain, BrowserView, BrowserWindow } from "electron";

export function registerIpcMainHandlers() {
  ipcMain.handle("view:create", async (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;

    console.log("create-view", viewData);
    let view2 = window
      .getBrowserViews()
      .find((view) => view.webContents.id === viewData.id);
    if (!view2) {
      view2 = new BrowserView();
      view2.setAutoResize({ width: false, height: false });
      view2.setBounds(viewData.bounds);
      if (viewData.url) view2.webContents.loadURL(viewData.url);
      window.addBrowserView(view2);
      console.log(
        `view created, id: ${view2.webContents.id} for ${viewData.url}`
      );

      const webContents = view2.webContents;
      webContents.on("did-navigate", (event, url) => {
        const viewInfo = {
          viewId: webContents.id,
          title: webContents.getTitle(),
          canGoBack: webContents.canGoBack(),
          canGoForward: webContents.canGoForward(),
          url: webContents.getURL(),
        };
        window.webContents.send("view-did-navigate", viewInfo);
        console.log(viewInfo);
      });
    }

    return view2.webContents.id;
  });

  ipcMain.handle("view:update", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("update-view:", viewData);
    const view2 = window
      .getBrowserViews()
      .find((view) => view.webContents.id === viewData.id);
    if (view2) {
      if (viewData.url) {
        view2.webContents.loadURL(viewData.url);
      }
      if (viewData.bounds) {
        view2.setBounds(viewData.bounds);
        window.setTopBrowserView(view2);
      }
    }
  });

  ipcMain.handle("view:go-back", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("go-back:", viewData);
    const view2 = window
      .getBrowserViews()
      .find((view) => view.webContents.id === viewData.id);
    if (view2) {
      view2.webContents.goBack();
    }
  });

  ipcMain.handle("view:go-forward", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("go-forward:", viewData);
    const view2 = window
      .getBrowserViews()
      .find((view) => view.webContents.id === viewData.id);
    if (view2) {
      view2.webContents.goForward();
    }
  });

  ipcMain.handle("view:destroy", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("destroy-view:", viewData);
    const view2 = window
      .getBrowserViews()
      .find((view) => view.webContents.id === viewData.id);
    if (view2) window.removeBrowserView(view2);
  });

  let hiddenViews: BrowserView[] = [];
  ipcMain.handle("view:hide-all", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("hide-views:", viewData);
    hiddenViews = [...window.getBrowserViews()];
    hiddenViews.forEach((view) => window.removeBrowserView(view));
  });

  ipcMain.handle("view:show-all", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("show-views:", viewData);
    hiddenViews.forEach((view) => window.addBrowserView(view));
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
    window.unmaximize();
  });

  ipcMain.handle("window:get-state", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("window:is-maximized", viewData);
    return {
      maximized: window.isMaximized(),
      minimized: window.isMinimized(),
    };
  });
}
