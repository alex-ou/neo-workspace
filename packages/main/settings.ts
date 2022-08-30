import {
  readSettingsFile,
  SettingsContent,
  writeSettingsFile,
} from "./storage/settings-file";

let settings: SettingsContent;

export function setSettings(newSettings: SettingsContent) {
  settings = newSettings;

  writeSettingsFile(settings);
}

export function getSetting(): SettingsContent {
  if (!settings) {
    settings = readSettingsFile();
  }
  return settings;
}
