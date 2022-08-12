import { getThreeWindowNode } from "../utils/mosaic-node";
import { getWorkspaces, saveWorkspaces } from "./app-storage";
import { Workspace, WorkspaceView } from "./workspace";

export interface AppState {
  workspaces: Workspace[];
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
  payload: Partial<Workspace>;
}

interface UpdateWorkspaceAction {
  type: "update-workspace";
  payload: Partial<Workspace>;
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
  | UpdateWorkspaceAction
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
    case "update-workspace":
      newState = updateWorkspace(state, action);
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

const getActiveViews = (state: AppState) =>
  state.workspaces.find((w) => w.isActive)?.views || [];

const _updateActiveWorkspace = (
  workspaces: Workspace[],
  payload: Partial<Workspace>
): Workspace[] => {
  return workspaces.map((w) => {
    if (w.isActive) {
      return {
        ...w,
        ...payload,
      };
    }

    return w;
  });
};

function createWorkspaceView(
  state: AppState,
  { payload }: CreateWorkspaceViewAction
): AppState {
  let views = getActiveViews(state);

  const index = views.findIndex((v) => v.containerId === payload.containerId);
  if (index !== -1 && views[index].viewId !== undefined) {
    return state;
  }

  views = [...views];
  if (index === -1) {
    views.push(payload);
  } else {
    views[index] = payload;
  }

  return {
    ...state,
    workspaces: _updateActiveWorkspace(state.workspaces, { views }),
  };
}

function updateWorkspaceView(
  state: AppState,
  { payload }: UpdateWorkspaceViewAction
): AppState {
  const views = getActiveViews(state).map((v) => {
    if (v.containerId === payload.containerId || v.viewId === payload.viewId) {
      return { ...v, ...payload };
    }
    return v;
  });
  return {
    ...state,
    workspaces: _updateActiveWorkspace(state.workspaces, { views }),
  };
}

function loadWorkspace(): AppState {
  const workspaces = getWorkspaces();

  if (workspaces.length === 0) {
    workspaces.push({
      id: crypto.randomUUID(),
      name: "Workspace 1",
      isActive: true,
      layout: getThreeWindowNode(),
      views: [],
    });
  }

  workspaces.forEach((w) => {
    if (!w.views) {
      w.views = [];
      return;
    }
    w.views = w.views.map((v) => ({
      containerId: v.containerId,
      viewId: undefined,
      url: v.url,
    }));
  });

  console.log("loading workspace");

  return {
    workspaces,
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
    layout: getThreeWindowNode(),
    views: [],
  };
  workspaces.push(newWorkspace);
  return {
    ...state,
    workspaces,
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
  let workspaces = state.workspaces.map((w) => {
    if (w.isActive) {
      return {
        ...w,
        isActive: false,
      };
    }

    if (w.id === payload.workspaceId) {
      return {
        ...w,
        isActive: true,
      };
    }

    return w;
  });

  return {
    ...state,
    workspaces,
  };
}

function updateActiveWorkspace(
  state: AppState,
  { payload }: UpdateActiveWorkspaceAction
): AppState {
  let workspaces = state.workspaces.map((w) => {
    if (w.isActive) {
      return {
        ...w,
        ...payload,
      };
    }

    return w;
  });

  return {
    ...state,
    workspaces,
  };
}

function updateWorkspace(
  state: AppState,
  { payload }: UpdateWorkspaceAction
): AppState {
  let workspaces = state.workspaces.map((w) => {
    if (w.id === payload.id) {
      return {
        ...w,
        ...payload,
      };
    }

    return w;
  });

  return {
    ...state,
    workspaces,
  };
}
