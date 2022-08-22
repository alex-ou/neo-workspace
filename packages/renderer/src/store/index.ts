import { createMosaicNode } from "./../utils/mosaic-node";
import { getWorkspaces, saveWorkspaces } from "./app-storage";
import { Workspace, WorkspaceView } from "./workspace";

export interface AppState {
  workspaces: Workspace[];
  removedWorkspaces: { workspace: Workspace; index: number }[];
}

interface LoadWorkspaceAction {
  type: "load-workspace";
}
interface AddWorkspaceAction {
  type: "add-workspace";
  payload: { name: string; url?: string; isActive: boolean };
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
interface OpenLastClosedWorkspaceAction {
  type: "open-last-closed-workspace";
}

export type AppAction =
  | UpdateWorkspaceViewAction
  | CreateWorkspaceViewAction
  | LoadWorkspaceAction
  | AddWorkspaceAction
  | RemoveWorkspaceAction
  | UpdateActiveWorkspaceAction
  | UpdateWorkspaceAction
  | OpenLastClosedWorkspaceAction
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
    case "open-last-closed-workspace":
      newState = openLastClosedWorkspace(state, action);
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

function openLastClosedWorkspace(
  state: AppState,
  _: OpenLastClosedWorkspaceAction
): AppState {
  const w = state.removedWorkspaces.pop();
  if (!w) {
    return state;
  }
  const workspaces = state.workspaces.map((w) => {
    if (w.isActive) {
      return { ...w, isActive: false };
    }
    return w;
  });
  workspaces.splice(w.index, 0, {
    ...w.workspace,
    isActive: true,
    views: w.workspace.views.map((v) => ({
      containerId: v.containerId,
      url: v.url,
    })),
  });
  return {
    ...state,
    workspaces,
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
      layout: createMosaicNode(),
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
    removedWorkspaces: [],
  };
}

function createWorkspace(
  state: AppState,
  { payload }: AddWorkspaceAction
): AppState {
  let workspaces: Workspace[];
  if (payload.isActive) {
    workspaces = state.workspaces.map((w) => {
      return !w.isActive
        ? w
        : {
            ...w,
            isActive: false,
          };
    });
  } else {
    workspaces = [...state.workspaces];
  }

  const containerId = createMosaicNode();
  const newWorkspace: Workspace = {
    id: crypto.randomUUID(),
    name: payload.name,
    isActive: payload.isActive,
    layout: containerId,
    views: [{ url: payload.url, containerId }],
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
  const index = state.workspaces.findIndex((w) => w.id === payload.workspaceId);
  if (index === -1) {
    return state;
  }

  const workspaces = [...state.workspaces];
  const workspaceToRemove = workspaces[index];

  if (workspaces.length === 1) {
    workspaces.push({
      id: crypto.randomUUID(),
      name: "New Workspace",
      isActive: true,
      layout: createMosaicNode(),
      views: [],
    });
  }

  if (workspaceToRemove.isActive) {
    let activeIndex = 0;
    if (index === workspaces.length - 1) {
      activeIndex = index - 1;
    } else {
      activeIndex = index + 1;
    }

    workspaces[activeIndex] = {
      ...workspaces[activeIndex],
      isActive: true,
    };
  }

  state.removedWorkspaces.push({
    workspace: workspaces[index],
    index,
  });
  if (state.removedWorkspaces.length > 10) {
    state.removedWorkspaces.shift();
  }

  workspaces.splice(index, 1);

  return {
    ...state,
    workspaces,
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
