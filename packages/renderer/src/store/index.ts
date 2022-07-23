import { getTwoColumnNode } from "../utils/mosaic-node";
import { getWorkspaces, saveWorkspaces } from "./app-storage";
import { Workspace, WorkspaceView } from "./Workspace";

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

interface UpdateWorkspaceViewAction {
  type: "update-workspace-view";
  payload: Partial<WorkspaceView>;
}

interface CreateWorkspaceViewAction {
  type: "create-workspace-view";
  payload: WorkspaceView;
}

export type AppAction =
  | UpdateWorkspaceViewAction
  | CreateWorkspaceViewAction
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
    case "create-workspace-view":
      newState = createWorkspaceView(state, action);
      break;
    case "update-workspace-view":
      newState = updateWorkspaceView(state, action);
      break;
  }

  saveWorkspaces(newState.workspaces);
  return newState;
}

function createWorkspaceView(
  state: AppState,
  { payload }: CreateWorkspaceViewAction
): AppState {
  const views = state.activeWorkspace?.views || [];
  if (views.find((v) => v.containerId === payload.containerId)) {
    return state;
  }

  return {
    ...state,
    activeWorkspace: {
      ...state.activeWorkspace!,
      views: views.concat(payload),
    },
  };
}

function updateWorkspaceView(
  state: AppState,
  { payload }: UpdateWorkspaceViewAction
): AppState {
  const views = state.activeWorkspace!.views.map((v) => {
    if (v.containerId === payload.containerId || v.viewId === payload.viewId) {
      return { ...v, ...payload };
    }
    return v;
  });
  return {
    ...state,
    activeWorkspace: {
      ...state.activeWorkspace!,
      views: views.concat(views),
    },
  };
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
      views: [],
    };
    workspaces.push(activeWorkspace);
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
    views: [],
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
