import {
  BrowserViewCommand,
  OpenUrlCommand,
  SwitchWorkspaceCommand,
  ViewCommandType,
} from "./../types";
import { handleAutoFillRequest, handleFormFilled } from "../password-manager";
import { useEffect } from "react";

type CommandFuncMap = {
  [key in Exclude<ViewCommandType, "openUrl" | "switchWorkspace">]?: (
    command: BrowserViewCommand
  ) => void;
} & {
  openUrl?: (command: OpenUrlCommand) => void;
  switchWorkspace?: (command: SwitchWorkspaceCommand) => void;
};

export function useViewCommands(map: CommandFuncMap, deps?: any[]) {
  useEffect(() => {
    const commandTypes = Object.keys(map);

    const listener = (e: CustomEvent<BrowserViewCommand>) => {
      const data = e.detail;
      if (commandTypes.includes(data.type)) {
        map[data.type]?.(data as any);
      }
    };
    document.addEventListener("viewcommand", listener);
    return () => {
      document.removeEventListener("viewcommand", listener);
    };
  }, [map, deps]);
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
