import { app, BrowserWindow, globalShortcut } from "electron";
import { BrowserView } from "electron";

const REMOVE_WORKSPACE_COMMAND_INDEX = 2;

const KEY_BINDINGS: {
  keys: string[];
  command: { type: string; commandData?: any };
}[] = [
  {
    keys: ["control", ","],
    command: { type: "openSettings" },
  },
  {
    keys: ["control", "t"],
    command: { type: "newWorkspace" },
  },
  {
    keys: ["control", "w"],
    command: { type: "removeWorkspace" },
  },
  {
    keys: ["control", "e"],
    command: { type: "editWorkspace" },
  },
  {
    keys: ["control", "shift", "t"],
    command: { type: "reopenLastClosedWorkspace" },
  },
  {
    keys: ["control", "l"],
    command: { type: "focusAddressBar" },
  },
  {
    keys: ["shift", "alt", "+"],
    command: { type: "splitWindowHorizontally" },
  },
  {
    keys: ["shift", "alt", "_"],
    command: { type: "splitWindowVertially" },
  },
  {
    keys: ["control", "shift", "w"],
    command: { type: "closeFocusingWindow" },
  },
  {
    keys: ["alt", "arrowup"],
    command: { type: "moveWindowFocusUp" },
  },
  {
    keys: ["alt", "arrowdown"],
    command: { type: "moveWindowFocusDown" },
  },
  {
    keys: ["alt", "arrowleft"],
    command: { type: "moveWindowFocusLeft" },
  },
  {
    keys: ["alt", "arrowright"],
    command: { type: "moveWindowFocusRight" },
  },

  {
    keys: ["escape"],
    command: { type: "closeSettings" },
  },
];
// ctrl+[1-9]
for (let i = 1; i < 10; i++) {
  KEY_BINDINGS.push({
    keys: ["control", String(i)],
    command: {
      type: "switchWorkspace",
      commandData: { workspaceIndex: i - 1 },
    },
  });
}

export function bindBrowserViewKeys(view: BrowserView, window: BrowserWindow) {
  bindKeys(view.webContents, window);
}

export function bindMainWindowKeys(window: BrowserWindow) {
  bindKeys(window.webContents, window);

  const sendRemoveWorkspaceCmd = () => {
    window.webContents.send(
      "app:browser-view-command",
      KEY_BINDINGS[REMOVE_WORKSPACE_COMMAND_INDEX].command
    );
  };
  //overrides this one to prevent win from being closed
  app.on("browser-window-focus", () =>
    globalShortcut.register("CommandOrControl+W", sendRemoveWorkspaceCmd)
  );
  app.on("browser-window-blur", () =>
    globalShortcut.unregister("CommandOrControl+W")
  );
}

export function bindKeys(
  keyReceivingWebContents: Electron.WebContents,
  window: BrowserWindow
) {
  keyReceivingWebContents.on("before-input-event", (event, input) => {
    if (input.type !== "keyDown") return;
    console.log(
      `input type: ${input.type}, ctrl:${input.control}, alt:${input.alt}, key:${input.key})`
    );

    const inputKey = input.key && input.key.toLowerCase();
    // chekcing order ctrl, shift, alt
    const pressedKeys: string[] = [];
    ["control", "shift", "alt"].forEach((key) => {
      //@ts-ignore
      if (input[key] && inputKey !== key) pressedKeys.push(key);
    });
    pressedKeys.push(inputKey);

    const matchedBinding = KEY_BINDINGS.find((binding) => {
      const boundKeys = binding.keys;
      if (boundKeys.length !== pressedKeys.length) {
        return false;
      }
      for (let i = 0; i < pressedKeys.length; i++) {
        if (boundKeys[i] !== pressedKeys[i]) {
          return false;
        }
      }

      return true;
    });

    if (matchedBinding) {
      console.log("key binding matched", pressedKeys, matchedBinding.command);

      window.webContents.send(
        "app:browser-view-command",
        matchedBinding.command
      );
    }
  });
}
