import { NeoNavAPI } from "../../preload/renderer-api/types";

export interface CapturePasswordDetail {
  viewId: string;
  data: { domain: string; username: string; password: string };
}
export interface ReaderModeReadyDetail {
  viewId: string;
}

export type ViewCommandType =
  | "openSettings"
  | "openKeyboardShortcuts"
  | "openUrl"
  | "newWorkspace"
  | "removeWorkspace"
  | "editWorkspace"
  | "switchWorkspace"
  | "reopenLastClosedWorkspace"
  | "focusAddressBar"
  | "splitWindowHorizontally"
  | "splitWindowVertically"
  | "closeFocusingWindow"
  | "moveWindowFocusUp"
  | "moveWindowFocusDown"
  | "moveWindowFocusLeft"
  | "moveWindowFocusRight";

export interface BrowserViewCommand {
  type: ViewCommandType;
}

export interface SwitchWorkspaceCommand {
  commandData: { workspaceIndex: number };
}
export interface OpenUrlCommand {
  commandData: {
    url: string;
    urlText: string;
    viewId?: string;
    location?: "right" | "bottom";
    inBackground?: boolean;
  };
}

declare global {
  interface Window {
    neonav: NeoNavAPI;
  }
}

interface CustomEventMap {
  capturepassword: CustomEvent<CapturePasswordDetail>;
  viewcommand: CustomEvent<BrowserViewCommand>;
  readermodeready: CustomEvent<ReaderModeReadyDetail>;
}

declare global {
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
  }
}
