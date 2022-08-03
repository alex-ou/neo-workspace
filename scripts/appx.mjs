import convertToWindowsStore from "electron-windows-store";

convertToWindowsStore({
  inputDirectory:
    "C:\\Users\\alexo\\w\\neo-workspace\\out\\NeoWorkspace-win32-x64",
  outputDirectory: ".\\out\\windows-store",
  assets: ".\\build\\appx\\",
  packageVersion: "1.0.0.0",
  packageName: "NeoWorkspace",
  packageDisplayName: "Neo Workspace",
  publisherDisplayName: "NeoNav",
  publisher: "CN=97AE30B3-5C2B-418F-AC5F-1F1B28631FF9",
  identityName: "29801UnityOne.NeoWorkspace",
});
