import {
  BrowserView,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  nativeImage,
  shell,
} from "electron";
import contextMenu from "electron-context-menu";
import { join } from "path";

import registerPasswordIpcHandlers from "./password-main";

import pkg from "../../package.json";

export function registerIpcMainHandlers() {
  registerPasswordIpcHandlers();

  ipcMain.handle("view:create", async (event, viewData) => {
    const window: BrowserWindow = BrowserWindow.fromWebContents(event.sender)!;

    console.log("create-view", viewData);
    let targetView = window
      .getBrowserViews()
      .find((view) => view.webContents.id === viewData.id);
    if (!targetView) {
      targetView = new BrowserView({
        webPreferences: {
          spellcheck: true,
          nodeIntegrationInSubFrames: true,
          scrollBounce: true,
          preload: join(__dirname, "../preload/index.cjs"),
          devTools: true,
          additionalArguments: ["--web-view"],
          minimumFontSize: 6,
        },
      });
      targetView.setAutoResize({ width: false, height: false });
      targetView.setBounds(viewData.bounds);
      contextMenu({
        window: targetView.webContents,
        showSearchWithGoogle: false,
        labels: {
          learnSpelling: "Add to dictionary",
          lookUpSelection: "Look up “{selection}",
          selectAll: "Select all",
          saveImage: "Save image",
          saveImageAs: "Save image as…",
          copyLink: "Copy link address",
          saveLinkAs: "Save link as...",
          copyImage: "Copy image",
          copyImageAddress: "Copy image address",
          inspect: "Inspect element",
        },
      });
      if (viewData.url) {
        targetView.webContents.loadURL(viewData.url);
      }
      // targetView.webContents.openDevTools();

      window.addBrowserView(targetView);
      console.log(
        `view created, id: ${targetView.webContents.id} for ${viewData.url}`
      );

      const icon = nativeImage.createFromPath(join(__dirname, "./logo.png"));

      const webContents = targetView.webContents;
      webContents.setWindowOpenHandler(({}) => {
        return {
          action: "allow",
          overrideBrowserWindowOptions: {
            icon,
            frames: false,
            autoHideMenuBar: true,
            webPreferences: {},
          },
        };
      });

      const getViewInfo = () => ({
        viewId: webContents.id,
        title: webContents.getTitle(),
        canGoBack: webContents.canGoBack(),
        canGoForward: webContents.canGoForward(),
        url: webContents.getURL(),
        isLoading: webContents.isLoading(),
      });
      const viewDidUpdate = () => {
        const viewInfo = getViewInfo();
        window.webContents.send("view:did-update", viewInfo);
      };
      webContents.on("did-navigate", viewDidUpdate);
      webContents.on("did-start-loading", () => {
        window.webContents.send("view:did-update", {
          viewId: webContents.id,
          title: webContents.getTitle(),
          canGoBack: webContents.canGoBack(),
          canGoForward: webContents.canGoForward(),
          isLoading: webContents.isLoading(),
        });
      });
      webContents.on("did-stop-loading", viewDidUpdate);
      webContents.on(
        "did-fail-load",
        (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
          if (isMainFrame) {
            window.webContents.send("view:did-update", {
              ...getViewInfo(),
              error: errorDescription,
            });
          }
        }
      );

      webContents.on("ipc-message", (e: any, channel, data) => {
        console.log("ipc-message", channel, data);
        window.webContents.send("view:ipc-message", {
          id: webContents.id,
          name: channel,
          data: data,
          frameId: e.frameId,
          frameURL: e.senderFrame.url,
        });
      });
    }

    return targetView.webContents.id;
  });

  ipcMain.handle("view:update", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("update-view:", viewData);
    const targetView = window
      .getBrowserViews()
      .find((view) => view.webContents.id === viewData.id);
    if (targetView) {
      if (viewData.url) {
        targetView.webContents.loadURL(viewData.url);
      }
      if (viewData.bounds) {
        targetView.setBounds(viewData.bounds);
        window.setTopBrowserView(targetView);
      }
    }
  });

  ipcMain.handle("view:go-back", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("go-back:", viewData);
    const targetView = window
      .getBrowserViews()
      .find((view) => view.webContents.id === viewData.id);
    if (targetView) {
      targetView.webContents.goBack();
    }
  });

  ipcMain.handle("view:go-forward", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("go-forward:", viewData);
    const targetView = window
      .getBrowserViews()
      .find((view) => view.webContents.id === viewData.id);
    if (targetView) {
      targetView.webContents.goForward();
    }
  });

  ipcMain.handle("view:destroy", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("destroy-view:", viewData);
    const targetView = window
      .getBrowserViews()
      .find((view) => view.webContents.id === viewData.id);
    if (targetView) {
      window.removeBrowserView(targetView);
      (targetView.webContents as any).destroy();
    }
  });

  let hiddenViews: BrowserView[] = [];

  ipcMain.handle("view:hide", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("hide-view:", viewData);
    const targetView = window
      .getBrowserViews()
      .find((view) => view.webContents.id === viewData.id);
    if (targetView) {
      window.removeBrowserView(targetView);
      hiddenViews = [targetView];
    }
  });

  ipcMain.handle("view:show", (event, viewData) => {
    const window = BrowserWindow.fromWebContents(event.sender)!;
    console.log("show-view:", viewData);
    const targetView = (hiddenViews || []).find(
      (v) => v.webContents.id === viewData.id
    );
    if (targetView) {
      window.addBrowserView(targetView);
      hiddenViews = (hiddenViews || []).filter(
        (v) => v.webContents.id !== viewData.id
      );
    }
  });

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

  ipcMain.on("app:show-app-menu", (event) => {
    console.log("app:show-app-menu");
    const template: MenuItemConstructorOptions[] = [
      {
        label: "Settings",
        click: () => {
          event.sender.send("app:menu-command", "Settings");
        },
      },
      { type: "separator" },
      {
        label: "Contact us",
        click: async () => {
          await shell.openExternal("https://www.neonav.co/#contacts");
        },
      },
      {
        label: "About",
        click: async () => {
          dialog.showMessageBox({
            title: "Neo Workspace",
            //@ts-ignore
            message: `Version ${pkg.version}\nWebsite: ${pkg.homepage}`,
            icon: nativeImage.createFromPath(join(__dirname, "./logo.png")),
          });
        },
      },
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup();
  });
}
