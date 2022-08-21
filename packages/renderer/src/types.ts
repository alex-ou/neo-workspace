import { NeoNavAPI } from "../../preload/renderer-api/types";

export interface CapturePasswordDetail {
  viewId: string;
  data: { domain: string; username: string; password: string };
}

export type ViewCommandType =
  | "openSettings"
  | "newWorkspace"
  | "removeWorkspace"
  | "editWorkspace"
  | "switchWorkspace"
  | "reopenLastClosedWorkspace";

export interface BrowserViewCommand {
  type: ViewCommandType;
  workspaceIndex?: number;
}
declare global {
  interface Window {
    neonav: NeoNavAPI;
  }
}

interface CustomEventMap {
  capturepassword: CustomEvent<CapturePasswordDetail>;
  viewcommand: CustomEvent<BrowserViewCommand>;
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
