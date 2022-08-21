import { BrowserWindow, BrowserView, ipcMain } from "electron";
import { join } from "path";
import { configureViewContextMenu } from "../context-menu";
import { bindBrowserViewKeys } from "../key-bindings";
import { logoIcon } from "../utils";

interface ViewIpcParams {
  view: BrowserView | undefined;
  window: BrowserWindow;
  viewData: any;
}

export function handleViewIpc(
  channel: string,
  func: (opts: ViewIpcParams) => Promise<any>
) {
  ipcMain.handle(channel, (event, viewData) => {
    console.log(channel, viewData);

    const window = BrowserWindow.fromWebContents(event.sender)!;
    let targetView = undefined;
    if (viewData && viewData.id) {
      targetView = window
        .getBrowserViews()
        .find((view) => view.webContents.id === viewData.id);
    }
    return func({ view: targetView, window, viewData });
  });
}

const getViewInfo = (webContents: Electron.WebContents) => ({
  viewId: webContents.id,
  title: webContents.getTitle(),
  canGoBack: webContents.canGoBack(),
  canGoForward: webContents.canGoForward(),
  url: webContents.getURL(),
  isLoading: webContents.isLoading(),
});

export const createView = async ({ view, window, viewData }: ViewIpcParams) => {
  let targetView = view;
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
    window.addBrowserView(targetView);
    if (viewData.url) {
      targetView.webContents.loadURL(viewData.url);
      targetView.setBounds(viewData.bounds);
    } else {
      targetView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    }

    configureViewContextMenu(targetView);

    // targetView.webContents.openDevTools();

    console.log(
      `view created: ID ${targetView.webContents.id} for ${viewData.url}`
    );

    const webContents = targetView.webContents;
    webContents.setWindowOpenHandler(({}) => {
      return {
        action: "allow",
        overrideBrowserWindowOptions: {
          icon: logoIcon,
          frames: false,
          autoHideMenuBar: true,
          webPreferences: {},
        },
      };
    });

    webContents.on("did-navigate", () =>
      window.webContents.send("view:did-update", getViewInfo(webContents))
    );

    webContents.on("did-start-loading", () => {
      window.webContents.send("view:did-update", {
        viewId: webContents.id,
        title: webContents.getTitle(),
        canGoBack: webContents.canGoBack(),
        canGoForward: webContents.canGoForward(),
        isLoading: webContents.isLoading(),
      });
    });

    webContents.on("did-stop-loading", () =>
      window.webContents.send("view:did-update", getViewInfo(webContents))
    );

    webContents.on(
      "did-fail-load",
      (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
        if (isMainFrame) {
          window.webContents.send("view:did-update", {
            ...getViewInfo(webContents),
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

    bindBrowserViewKeys(targetView, window);
  }

  return targetView.webContents.id;
};

export function registerViewIpcHandler() {
  handleViewIpc("view:create", createView);
  handleViewIpc("view:update", async ({ view, window, viewData }) => {
    if (!view) return;
    if (viewData.url) {
      view.webContents.loadURL(viewData.url);
    }
    if (viewData.bounds) {
      view.setBounds(viewData.bounds);
      window.setTopBrowserView(view);
      view.webContents.focus();
    }
  });
  handleViewIpc("view:go-back", async ({ view }) => {
    if (!view) return;
    view.webContents.goBack();
  });
  handleViewIpc("view:go-forward", async ({ view }) => {
    if (!view) return;
    view.webContents.goForward();
  });
  handleViewIpc("view:destroy", async ({ view, window }) => {
    if (view) {
      window.removeBrowserView(view);
      (view.webContents as any).destroy();
    }
  });

  let hiddenViews: BrowserView[] = [];

  handleViewIpc("view:hide", async ({ view, window }) => {
    if (view) {
      window.removeBrowserView(view);
      hiddenViews = [view];
    }
  });

  handleViewIpc("view:show", async ({ window, viewData }) => {
    const targetView = (hiddenViews || []).find(
      (v) => v.webContents.id === viewData.id
    );
    if (targetView) {
      window.addBrowserView(targetView);
      window.setTopBrowserView(targetView);
      targetView.webContents.focus();

      hiddenViews = (hiddenViews || []).filter(
        (v) => v.webContents.id !== viewData.id
      );
    }
  });

  handleViewIpc("view:hide-all", async ({ window }) => {
    hiddenViews = [...window.getBrowserViews()];
    hiddenViews.forEach((view) => window.removeBrowserView(view));
  });

  handleViewIpc("view:show-all", async ({ window }) => {
    hiddenViews.forEach((view) => window.addBrowserView(view));
  });
}
