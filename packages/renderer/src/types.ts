import { NeoNavAPI } from "../../preload/renderer-api/types";

export interface CapturePasswordDetail {
  viewId: string;
  data: { domain: string; username: string; password: string };
}
export interface MenuCommand {
  command: string;
}
declare global {
  interface Window {
    neonav: NeoNavAPI;
  }
}

interface CustomEventMap {
  capturepassword: CustomEvent<CapturePasswordDetail>;
  menucommand: CustomEvent<MenuCommand>;
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
