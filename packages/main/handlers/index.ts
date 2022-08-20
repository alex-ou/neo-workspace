import { registerMenuIpcHandler } from "./app-menu-handler";
import { registerViewIpcHandler } from "./view-handler";

import { registerPasswordIpcHandler } from "./password-handler";
import { registerWindowIpcHandler } from "./window-handler";

export function registerIpcHandlers() {
  registerPasswordIpcHandler();
  registerMenuIpcHandler();
  registerWindowIpcHandler();
  registerViewIpcHandler();
}
