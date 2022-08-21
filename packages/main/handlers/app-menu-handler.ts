import {
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
} from "electron";
import pkg from "../../../package.json";
import { logoIcon } from "../utils";

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
        event.sender.send("app:browser-view-command", {
          type: "openUrl",
          commandData: {
            title: "ContatUs",
            url: "https://www.neonav.co/#contacts",
          },
        });
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
  menu.popup();
}

export function registerMenuIpcHandler() {
  ipcMain.on("app:show-app-menu", appMenuHanlder);
}
