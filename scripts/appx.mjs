import convertToWindowsStore from "electron-windows-store";

convertToWindowsStore({
  inputDirectory:
    "C:\\Users\\alexo\\w\\unity-workspace\\out\\UnityWorkspace-win32-x64",
  outputDirectory: "C:\\Users\\alexo\\w\\unity-workspace\\out\\windows-store",
  packageVersion: "1.0.0.0",
  packageName: "NeoWorkspace",
  packageDisplayName: "Neo Workspace",
  publisherDisplayName: "NeoNav",
  publisher: "CN=97AE30B3-5C2B-418F-AC5F-1F1B28631FF9",
  name: "29801UnityOne.UnityWorkspace",
  identityName: "29801UnityOne.UnityWorkspace",
});
