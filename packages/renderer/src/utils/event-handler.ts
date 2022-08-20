import { BrowserViewCommand, ViewCommandType } from "./../types";
import { handleAutoFillRequest, handleFormFilled } from "../password-manager";
import { useEffect } from "react";

export function useViewCommand(
  commandTypes: ViewCommandType[] | ViewCommandType,
  callback: (command: BrowserViewCommand) => void
) {
  useEffect(() => {
    const typesArray = Array.isArray(commandTypes)
      ? commandTypes
      : [commandTypes];

    const listener = (e: CustomEvent<BrowserViewCommand>) => {
      const data = e.detail;
      if (typesArray.includes(data.type)) {
        callback(data);
      }
    };
    document.addEventListener("viewcommand", listener);
    return () => {
      document.removeEventListener("viewcommand", listener);
    };
  }, [commandTypes]);
}

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
