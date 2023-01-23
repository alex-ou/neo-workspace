import { nativeImage } from "electron";
import { join } from "path";

export const logoIcon = nativeImage.createFromPath(
  join(__dirname, "./logo.png")
);
