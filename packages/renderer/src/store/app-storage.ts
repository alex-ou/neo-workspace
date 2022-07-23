import { Workspace, WorkspaceView } from "./Workspace";

const WORKSPACE_KEY = "workspaces";

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
