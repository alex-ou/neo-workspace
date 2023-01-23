import {
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
} from "electron";
import pkg from "../../../package.json";
import { logoIcon } from "../utils";

function appMenuHandler(event: Electron.IpcMainEvent) {
  const window = BrowserWindow.fromWebContents(event.sender)!;

  const template: MenuItemConstructorOptions[] = [
    {
      label: "Toggle full screen",
      accelerator: "F11",
      click: () => {
        window.setFullScreen(!window.isFullScreen());
      },
    },
    { type: "separator" },

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
      label: "Keyboard shortcuts",
      accelerator: "CommandOrControl+.",
      click: async () => {
        event.sender.send("app:browser-view-command", {
          type: "openKeyboardShortcuts",
        });
      },
    },
    {
      label: "Contact us",
      click: async () => {
        event.sender.send("app:browser-view-command", {
          type: "openUrl",
          commandData: {
            urlText: "ContactUs",
            url: "https://www.neonav.co/#contacts",
            inBackground: false,
          },
        });
      },
    },
    {
      label: "About",
      click: async () => {
        dialog.showMessageBox({
          title: "Neo Navigator",
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
  ipcMain.on("app:show-app-menu", appMenuHandler);
}
