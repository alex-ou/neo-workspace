import convertToWindowsStore from "electron-windows-store";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

convertToWindowsStore({
  inputDirectory:
    "C:\\Users\\alexo\\w\\neo-workspace\\out\\NeoNavigator-win32-x64",
  outputDirectory: ".\\out\\windows-store",
  assets: ".\\build\\appx\\",
  packageVersion: require("../package.json").version + ".0",
  packageName: "NeoNavigator",
  packageDisplayName: "Neo Navigator",
  publisherDisplayName: "NeoNav",
  publisher: "CN=97AE30B3-5C2B-418F-AC5F-1F1B28631FF9",
  identityName: "29801UnityOne.NeoWorkspace",
});
