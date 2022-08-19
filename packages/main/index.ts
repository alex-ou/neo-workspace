import { join } from "path";
import { app, BrowserWindow, nativeImage } from "electron";
import { registerIpcMainHandlers } from "./ipc-main";
import contextMenu from "electron-context-menu";
import "./download";

if (require("electron-squirrel-startup")) {
  app.quit();
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

require("update-electron-app")({
  repo: "neonav-co/neonav-co.github.io",
});

if (process.platform === "win32") {
  app.setAppUserModelId(app.name);
}

// app.commandLine.appendSwitch("lang", "zh");

// catch unhandled exception
process.on("uncaughtException", function (error) {
  console.error(error);
});

let win: BrowserWindow | null = null;

const devTools = !import.meta.env.PROD;

async function createWindow() {
  const icon = nativeImage.createFromPath(join(__dirname, "./logo.png"));

  win = new BrowserWindow({
    title: "Main window",
    icon,
    width: 1000,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "../preload/index.cjs"),
      devTools,
      additionalArguments: ["--main-window"],
    },
    frame: false,
  });

  contextMenu({
    window: win,
    menu: (actions) => [actions.cut({}), actions.copy({}), actions.paste({})],
  });

  if (import.meta.env.PROD) {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}`;

    win.loadURL(url);
    // win.webContents.openDevTools({ mode: "undocked" });
  }
}

app.whenReady().then(() => {
  console.log("app locale:", app.getLocale());
  createWindow();
  app.setJumpList([]);

  registerIpcMainHandlers();
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
