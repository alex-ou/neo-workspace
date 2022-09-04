import { registerMenuIpcHandler } from "./app-menu-handler";
import { registerViewIpcHandler } from "./view-handler";

import { registerPasswordIpcHandler } from "./password-handler";
import { registerWindowIpcHandler } from "./window-handler";
import { registerSettingsIpcHandler } from "./settings-handler";
import { registerReaderModeIpcHandler } from "./reader-mode-handler";

export function registerIpcHandlers() {
  registerPasswordIpcHandler();
  registerMenuIpcHandler();
  registerSettingsIpcHandler();
  registerWindowIpcHandler();
  registerViewIpcHandler();
  registerReaderModeIpcHandler();
}
