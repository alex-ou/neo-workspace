import { Workspace } from "./workspace";

const WORKSPACE_KEY = "workspaces";
const SETTINGS_KEY = "neo_settings";

function getItem(key: string): any {
  const value = localStorage.getItem(key);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error(error);
  }
  return null;
}

function setItem(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getWorkspaces(): Workspace[] {
  return getItem(WORKSPACE_KEY) || [];
}

export function saveWorkspaces(values: Workspace[]) {
  return setItem(WORKSPACE_KEY, values || []);
}

export function setSettings(settings: any) {
  setItem(SETTINGS_KEY, settings);
}

export function getSettings() {
  const result = getItem(SETTINGS_KEY);
  return result;
}
