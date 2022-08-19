import { BrowserView, BrowserWindow } from "electron";
import contextMenu from "electron-context-menu";

export function configureMainContextMenu(win: BrowserWindow) {
  contextMenu({
    window: win,
    menu: (actions) => [actions.cut({}), actions.copy({}), actions.paste({})],
  });
}

export function configureViewContextMenu(view: BrowserView) {
  contextMenu({
    window: view.webContents,
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
}
