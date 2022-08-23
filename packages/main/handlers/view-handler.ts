import { BrowserWindow, BrowserView, ipcMain } from "electron";
import { join } from "path";
import { configureViewContextMenu } from "../context-menu";
import { bindBrowserViewKeys } from "../key-bindings";
import { logoIcon } from "../utils";

const BLANK_PAGE_URL = "about:blank";

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

    const window: BrowserWindow = BrowserWindow.fromWebContents(event.sender)!;
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
  url: webContents.getURL().replace(BLANK_PAGE_URL, ""),
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
    targetView.setBounds(viewData.bounds);

    targetView.webContents.loadURL(viewData.url || BLANK_PAGE_URL);

    configureViewContextMenu(targetView, window);

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

    webContents.on("focus", () => {
      console.log("view focus", webContents.id);
    });

    webContents.on("did-navigate", () => {
      console.log("did-navigate", webContents.getURL());
      if (webContents.getURL() === BLANK_PAGE_URL) {
        return;
      }

      window.webContents.send("view:did-update", getViewInfo(webContents));
    });

    webContents.on("did-start-loading", () => {
      console.log("did-start-loading", webContents.id, webContents.getURL());

      window.webContents.send("view:did-update", {
        ...getViewInfo(webContents),
        url: undefined,
      });
    });

    webContents.on("did-stop-loading", () => {
      console.log("did-stop-loading", webContents.id, webContents.getURL());

      window.webContents.send("view:did-update", {
        ...getViewInfo(webContents),
        url: undefined,
      });
    });

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
    }
    if (viewData.url) {
      view.webContents.focus();
    } else {
      window.webContents.focus();
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
