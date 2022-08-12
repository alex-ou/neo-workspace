import { MenuCommand } from "./../types";
import { handleAutoFillRequest, handleFormFilled } from "../password-manager";

export function registerEventHandlers() {
  const { passwordService, application } = window.neonav;

  passwordService.onAutoFill(handleAutoFillRequest);
  passwordService.onFormFilled(handleFormFilled);

  application.onContextMenuCommand((e, command) => {
    console.log("onContextMenuCommand", e, command);
    document.dispatchEvent(
      new CustomEvent<MenuCommand>("menucommand", { detail: { command } })
    );
  });
}
