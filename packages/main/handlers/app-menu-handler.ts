import {
  dialog,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  shell,
} from "electron";
import { logoIcon } from "../utils";
import pkg from "../../../package.json";

function appMenuHanlder(event: Electron.IpcMainEvent) {
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
