import { Unity1API } from "../../preload/renderer-api/types";

declare global {
  interface Window {
    unity1: Unity1API;
  }
}
