import { getTwoColumnNode } from "../utils/mosaic-node";
import { getWorkspaces, saveWorkspaces } from "./app-storage";
import { Workspace } from "./Workspace";

export interface AppState {
  workspaces: Workspace[];
  activeWorkspace?: Workspace;
}

interface LoadWorkspaceAction {
  type: "load-workspace";
}
interface AddWorkspaceAction {
  type: "add-workspace";
  payload: { name: string };
}
interface RemoveWorkspaceAction {
  type: "remove-workspace";
  payload: {
    workspaceId: string;
  };
}
interface SwitchWorkspaceAction {
  type: "switch-workspace";
  payload: {
    workspaceId: string;
  };
}

interface UpdateActiveWorkspaceAction {
  type: "update-active-workspace";
  payload: Workspace;
}

export type AppAction =
  | LoadWorkspaceAction
  | AddWorkspaceAction
  | RemoveWorkspaceAction
  | UpdateActiveWorkspaceAction
  | SwitchWorkspaceAction;

export function reducer(state: AppState, action: AppAction): AppState {
  let newState = state;
  switch (action.type) {
    case "load-workspace":
      newState = loadWorkspace();
      break;
    case "add-workspace":
      newState = createWorkspace(state, action);
      break;
    case "remove-workspace":
      newState = removeWorkspace(state, action);
      break;
    case "switch-workspace":
      newState = switchWorkspace(state, action);
      break;
    case "update-active-workspace":
      newState = updateActiveWorkspace(state, action);
      break;
  }

  saveWorkspaces(newState.workspaces);
  return newState;
}

function loadWorkspace(): AppState {
  const workspaces = getWorkspaces();

  const activeOnes = workspaces.filter((w) => w.isActive);
  let activeWorkspace;
  if (activeOnes.length > 0) {
    activeWorkspace = activeOnes[0];
  } else {
    activeWorkspace = {
      id: crypto.randomUUID(),
      name: "Workspace 1",
      isActive: true,
      layout: getTwoColumnNode(),
    };
  }

  console.log("loading workspace");

  return {
    workspaces,
    activeWorkspace,
  };
}

function createWorkspace(
  state: AppState,
  action: AddWorkspaceAction
): AppState {
  let workspaces = state.workspaces.map((w) => {
    return !w.isActive
      ? w
      : {
          ...w,
          isActive: false,
        };
  });
  const newWorkspace: Workspace = {
    id: crypto.randomUUID(),
    name: action.payload.name,
    isActive: true,
    layout: getTwoColumnNode(),
  };
  workspaces.push(newWorkspace);
  return {
    ...state,
    workspaces,
    activeWorkspace: newWorkspace,
  };
}

function removeWorkspace(
  state: AppState,
  { payload }: RemoveWorkspaceAction
): AppState {
  return {
    ...state,
    workspaces: state.workspaces.filter((w) => w.id !== payload.workspaceId),
  };
}

function switchWorkspace(
  state: AppState,
  { payload }: SwitchWorkspaceAction
): AppState {
  let activeWorkspace: Workspace = state.activeWorkspace!;

  let workspaces = state.workspaces.map((w) => {
    if (w.isActive) {
      return {
        ...w,
        isActive: false,
      };
    }

    if (w.id === payload.workspaceId) {
      activeWorkspace = {
        ...w,
        isActive: true,
      };
      return activeWorkspace;
    }

    return w;
  });

  return {
    ...state,
    workspaces,
    activeWorkspace,
  };
}

function updateActiveWorkspace(
  state: AppState,
  { payload }: UpdateActiveWorkspaceAction
): AppState {
  let activeWorkspace: Workspace = {
    ...payload,
  };

  let workspaces = state.workspaces.map((w) => {
    if (w.id === payload.id) {
      return activeWorkspace;
    }

    return w;
  });

  return {
    ...state,
    workspaces,
    activeWorkspace,
  };
}
