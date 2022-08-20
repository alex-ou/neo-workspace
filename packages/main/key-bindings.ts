import { BrowserWindow } from "electron";
import { BrowserView } from "electron";

export function bindBrowserViewKeys(view: BrowserView, window: BrowserWindow) {
  bindKeys(view.webContents, window);
}

export function bindMainWindowKeys(window: BrowserWindow) {
  bindKeys(window.webContents, window);
}

const keyBindings: {
  keys: string[];
  command: { type: string; workspaceIndex?: number };
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
    keys: ["control", "shift", "t"],
    command: { type: "reopenLastClosedWorkspace" },
  },
];
for (let i = 1; i < 10; i++) {
  keyBindings.push({
    keys: ["control", String(i)],
    command: { type: "switchWorkspace", workspaceIndex: i - 1 },
  });
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

    const matchedBinding = keyBindings.find((binding) => {
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
