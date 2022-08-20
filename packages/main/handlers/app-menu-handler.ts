import {
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  shell,
} from "electron";
import { logoIcon } from "../utils";
import pkg from "../../../package.json";

function appMenuHanlder(event: Electron.IpcMainEvent) {
  const window = BrowserWindow.fromWebContents(event.sender)!;

  const template: MenuItemConstructorOptions[] = [
    {
      label: "Settings",
      accelerator: "CommandOrControl+,",
      click: () => {
        event.sender.send("app:browser-view-command", {
          type: "openSettings",
        });
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
          icon: logoIcon,
        });
      },
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  window.setMenu(menu);
  menu.popup();
}

export function registerMenuIpcHandler() {
  ipcMain.on("app:show-app-menu", appMenuHanlder);
}
