import { NeoNavAPI } from "../../preload/renderer-api/types";

declare global {
  interface Window {
    neonav: NeoNavAPI;
  }
}
