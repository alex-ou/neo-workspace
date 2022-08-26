import { handleAutoFillRequest, handleFormFilled } from "../password-manager";
import { BrowserViewCommand } from "./../types";

export function registerEventHandlers() {
  const { passwordService, application } = window.neonav;

  passwordService.onAutoFill(handleAutoFillRequest);
  passwordService.onFormFilled(handleFormFilled);

  application.onBrowserViewCommand((e, command) => {
    console.log("onBrowserViewCommand", e, command);
    document.dispatchEvent(
      new CustomEvent<BrowserViewCommand>("viewcommand", {
        detail: command,
      })
    );
  });
}
