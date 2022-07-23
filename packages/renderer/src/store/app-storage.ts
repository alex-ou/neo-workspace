import { Workspace, WorkspaceView } from "./Workspace";

const WORKSPACE_KEY = "workspaces";
const VIEW_KEY = "workspace-views";

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

export function getViews(): WorkspaceView[] {
  return getItem(VIEW_KEY) || [];
}

export function saveViews(values: WorkspaceView[]) {
  return setItem(VIEW_KEY, values || []);
}
