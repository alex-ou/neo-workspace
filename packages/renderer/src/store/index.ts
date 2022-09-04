import { defaultViewManager } from "./../utils/view-manager";
import { createMosaicNode } from "./../utils/mosaic-node";
import {
  getPinnedWorkspaceIds,
  getWorkspaces,
  savePinnedWorkspaceIds,
  saveWorkspaces,
} from "./app-storage";
import { Workspace, WorkspaceView } from "./workspace";
import { Classes } from "@blueprintjs/core";

export interface AppState {
  workspaces: Workspace[];
  removedWorkspaces: { workspace: Workspace; index: number }[];
  pinnedWorkspaceIds: string[];
  currentTheme: string;
  isSidebarVisible: boolean;
}
interface SetThemeAction {
  type: "set-theme";
  payload: {
    theme: "light" | "dark";
  };
}
interface ToggleSidebarAction {
  type: "toggle-sidebar";
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

interface SetReaderModeAction {
  type: "set-reader-mode";
  payload: {
    containerId?: string;
    viewId?: string;
    isInReaderMode: boolean;
  };
}

interface CreateWorkspaceViewAction {
  type: "create-workspace-view";
  payload: WorkspaceView;
}

interface RemoveWorkspaceViewAction {
  type: "remove-workspace-view";
  payload: {
    containerId: string;
  };
}

interface OpenLastClosedWorkspaceAction {
  type: "open-last-closed-workspace";
}

interface PinWorkspaceAction {
  type: "pin-workspace";
  payload: {
    workspaceId: string;
  };
}
interface UnpinWorkspaceAction {
  type: "unpin-workspace";
  payload: {
    workspaceId: string;
  };
}

export type AppAction =
  | SetReaderModeAction
  | ToggleSidebarAction
  | SetThemeAction
  | PinWorkspaceAction
  | UnpinWorkspaceAction
  | UpdateWorkspaceViewAction
  | CreateWorkspaceViewAction
  | RemoveWorkspaceViewAction
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
    case "set-theme":
      newState = setTheme(state, action);
      break;
    case "toggle-sidebar":
      newState = toggleSidebar(state, action);
      break;
    case "load-workspace":
      newState = loadWorkspace(state);
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

    case "update-workspace":
      newState = updateWorkspace(state, action);
      break;
    case "update-active-workspace":
      newState = updateActiveWorkspace(state, action);
      break;
    case "pin-workspace":
      newState = pinWorkspace(state, action);
      break;
    case "unpin-workspace":
      newState = unpinWorkspace(state, action);
      break;

    case "open-last-closed-workspace":
      newState = openLastClosedWorkspace(state, action);
      break;

    case "create-workspace-view":
      newState = createWorkspaceView(state, action);
      break;
    case "update-workspace-view":
      newState = updateWorkspaceView(state, action);
      break;
    case "set-reader-mode":
      newState = setWorkspaceViewReaderMode(state, action);
      break;
    case "remove-workspace-view":
      newState = removeWorkspaceView(state, action);
      break;
  }

  saveWorkspaces(newState.workspaces);
  savePinnedWorkspaceIds(newState.pinnedWorkspaceIds);
  return newState;
}

function setTheme(state: AppState, { payload }: SetThemeAction): AppState {
  const isDarkTheme = payload.theme === "dark";
  document.getElementById("root")!.classList.toggle(Classes.DARK, isDarkTheme);
  document
    .querySelector(".mosaic-blueprint-theme")!
    .classList.toggle(Classes.DARK, isDarkTheme);

  window.neonav.window.setTheme({
    theme: payload.theme,
  });

  getActiveViews(state)
    .filter((v) => v.isInReaderMode)
    .forEach((v) =>
      window.neonav.readerModeService.showReaderView(v.viewId!, payload.theme)
    );

  return {
    ...state,
    currentTheme: payload.theme,
  };
}

function toggleSidebar(state: AppState, {}: ToggleSidebarAction): AppState {
  return {
    ...state,
    isSidebarVisible: !state.isSidebarVisible,
  };
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
  console.log("createWorkspaceView", payload);

  let views = getActiveViews(state);

  const index = views.findIndex((v) => v.containerId === payload.containerId);
  if (index !== -1 && views[index].viewId !== undefined) {
    return state;
  }

  views = [...views];

  if (payload.isFocused) {
    views = views.map((v) => (v.isFocused ? { ...v, isFocused: false } : v));
  }
  if (index === -1) {
    views.push(payload);
  } else {
    views[index] = { ...views[index], ...payload };
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
  console.log("updateWorkspaceView", payload);

  const isSameView = (v: WorkspaceView) =>
    v.containerId === payload.containerId ||
    (payload.viewId && v.viewId === payload.viewId);

  let views = getActiveViews(state);
  const index = views.findIndex(isSameView);
  if (index === -1) {
    return state;
  }

  views = [...views];

  if (payload.isFocused) {
    views = views.map((v) => (v.isFocused ? { ...v, isFocused: false } : v));
  }

  const view = views[index];
  views[index] = {
    ...view,
    ...payload,
    isInReaderMode: payload.isLoading ? false : view.isInReaderMode,
  };

  return {
    ...state,
    workspaces: _updateActiveWorkspace(state.workspaces, { views }),
  };
}

function setWorkspaceViewReaderMode(
  state: AppState,
  { payload }: SetReaderModeAction
): AppState {
  const isSameView = (v: WorkspaceView) =>
    v.containerId === payload.containerId ||
    (payload.viewId && v.viewId === payload.viewId);

  let views = getActiveViews(state);
  const index = views.findIndex(isSameView);
  if (index === -1) {
    return state;
  }

  views = [...views];

  const view = views[index];
  views[index] = {
    ...view,
    isInReaderMode: payload.isInReaderMode,
  };

  if (payload.isInReaderMode) {
    window.neonav.readerModeService.showReaderView(
      view.viewId!,
      state.currentTheme
    );
  } else {
    window.neonav.view.reload(view.viewId!);
  }

  return {
    ...state,
    workspaces: _updateActiveWorkspace(state.workspaces, { views }),
  };
}

function removeWorkspaceView(
  state: AppState,
  { payload }: RemoveWorkspaceViewAction
): AppState {
  defaultViewManager.destroyView(payload.containerId);

  let views = getActiveViews(state);
  const index = views.findIndex((v) => v.containerId === payload.containerId);
  if (index === -1) {
    return state;
  }

  views = [...views];
  const viewToRemove = views[index];
  if (viewToRemove.isFocused) {
    const activeIndex = index < views.length - 1 ? index + 1 : index - 1;
    views[activeIndex] = {
      ...views[activeIndex],
      isFocused: true,
    };
  }

  views.splice(index, 1);

  return {
    ...state,
    workspaces: _updateActiveWorkspace(state.workspaces, { views }),
  };
}

function loadWorkspace(state: AppState): AppState {
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
    const views = w.views.map((v) => ({
      containerId: v.containerId,
      viewId: undefined,
      url: v.url,
    }));
    w.views = [];
    //dedup
    views.forEach((v) => {
      if (
        v.containerId &&
        w.views.findIndex((wv) => wv.containerId === v.containerId) === -1
      )
        w.views.push(v);
    });
  });

  console.log("loading workspace");

  const pinnedWorkspaceIds = getPinnedWorkspaceIds().filter((id) =>
    workspaces.some((w) => w.id === id)
  );

  return {
    ...state,
    workspaces,
    pinnedWorkspaceIds,
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

  workspaceToRemove.views.forEach((v) =>
    defaultViewManager.destroyView(v.containerId)
  );

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
    if (w.isActive && w.id !== payload.workspaceId) {
      return {
        ...w,
        isActive: false,
      };
    }

    if (w.id === payload.workspaceId && !w.isActive) {
      return {
        ...w,
        isActive: true,
      };
    }

    return w;
  });

  const newState = {
    ...state,
    workspaces,
  };

  getActiveViews(newState)
    .filter((v) => v.isInReaderMode)
    .forEach((v) => window.neonav.readerModeService.showReaderView(v.viewId!));

  return newState;
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

function pinWorkspace(
  state: AppState,
  { payload }: PinWorkspaceAction
): AppState {
  return {
    ...state,
    pinnedWorkspaceIds: [...state.pinnedWorkspaceIds, payload.workspaceId],
  };
}
function unpinWorkspace(
  state: AppState,
  { payload }: UnpinWorkspaceAction
): AppState {
  return {
    ...state,
    pinnedWorkspaceIds: state.pinnedWorkspaceIds.filter(
      (id) => id !== payload.workspaceId
    ),
  };
}
