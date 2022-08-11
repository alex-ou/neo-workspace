import { NeoNavAPI } from "../../preload/renderer-api/types";
import { CapturePasswordDetail } from "./password-manager";

declare global {
  interface Window {
    neonav: NeoNavAPI;
  }
}

interface CustomEventMap {
  capturepassword: CustomEvent<CapturePasswordDetail>;
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
