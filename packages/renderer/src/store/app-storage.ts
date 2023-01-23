import { Workspace } from "./workspace";

const WORKSPACE_KEY = "workspaces";
const PINNED_WORKSPACE_IDS_KEY = "neo_pinned_workspace_ids";
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

export function getPinnedWorkspaceIds(): string[] {
  return getItem(PINNED_WORKSPACE_IDS_KEY) || [];
}

export function savePinnedWorkspaceIds(values: string[]) {
  return setItem(PINNED_WORKSPACE_IDS_KEY, values || []);
}

export function setSettings(settings: any) {
  setItem(SETTINGS_KEY, settings);
}

export function getSettings() {
  const result = getItem(SETTINGS_KEY);
  return result;
}
