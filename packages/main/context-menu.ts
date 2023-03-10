import { BrowserView, BrowserWindow } from "electron";
import contextMenu from "electron-context-menu";

export function configureMainContextMenu(win: BrowserWindow) {
  contextMenu({
    window: win,
    menu: (actions) => [actions.cut({}), actions.copy({}), actions.paste({})],
  });
}

export function configureViewContextMenu(
  view: BrowserView,
  window: BrowserWindow
) {
  const sendOpenUrlCommand = (url: string, location: "right" | "bottom") => {
    window.webContents.send("app:browser-view-command", {
      type: "openUrl",
      commandData: {
        url,
        viewId: view.webContents.id,
        location,
        inBackground: true,
      },
    });
  };
  contextMenu({
    window: view.webContents,
    showCopyImageAddress: true,
    showSearchWithGoogle: false,
    showSelectAll: false,
    prepend: (defaultActions, params, browserView) => {
      const webContents = browserView as Electron.WebContents;

      return [
        {
          label: "Open link in new pane to the right",
          visible: !!params.linkURL,
          click: () => sendOpenUrlCommand(params.linkURL, "right"),
        },
        {
          label: "Open link in new pane below",
          visible: !!params.linkURL,
          click: () => sendOpenUrlCommand(params.linkURL, "bottom"),
        },
        {
          label: "Open link in new workspace",
          visible: !!params.linkURL,
          click: () => {
            window.webContents.send("app:browser-view-command", {
              type: "openUrl",
              commandData: {
                urlText: params.linkText,
                url: params.linkURL,
                inBackground: true,
              },
            });
          },
        },

        {
          label: "Back",
          visible: !params.isEditable && !params.linkURL,
          enabled: webContents.canGoBack(),
          click: () => webContents.goBack(),
        },
        {
          label: "Forward",
          visible: !params.isEditable && !params.linkURL,
          enabled: webContents.canGoForward(),
          click: () => webContents.goForward(),
        },
        {
          label: "Reload",
          visible: !params.isEditable && !params.linkURL,
          click: () => webContents.reload(),
        },
      ];
    },
    labels: {
      learnSpelling: "Add to dictionary",
      lookUpSelection: "Look up ???{selection}",
      selectAll: "Select all",
      saveImage: "Save image",
      saveImageAs: "Save image as???",
      copyLink: "Copy link address",
      saveLinkAs: "Save link as...",
      copyImage: "Copy image",
      copyImageAddress: "Copy image address",
      inspect: "Inspect element",
    },
  });
}
