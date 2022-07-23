import { getViews, saveViews } from "./app-storage";
import { WorkspaceView } from "./Workspace";

export interface ViewState {
  views: WorkspaceView[];
}

interface LoadViewsAction {
  type: "load-views";
}
interface UpdateWorkspaceViewAction {
  type: "update-workspace-view";
  payload: Partial<WorkspaceView>;
}

interface CreateWorkspaceViewAction {
  type: "create-workspace-view";
  payload: WorkspaceView;
}
export type ViewAction =
  | LoadViewsAction
  | CreateWorkspaceViewAction
  | UpdateWorkspaceViewAction;

export function viewReducer(state: ViewState, action: ViewAction): ViewState {
  let newState = state;
  switch (action.type) {
    case "load-views":
      newState = loadViews();
      break;
    case "create-workspace-view":
      newState = createWorkspaceView(state, action);
      break;
    case "update-workspace-view":
      newState = updateWorkspaceView(state, action);
      break;
  }

  saveViews(newState.views);
  return newState;
}

function loadViews(): ViewState {
  const views: WorkspaceView[] = getViews().map((v) => ({
    containerId: v.containerId,
    viewId: undefined,
    url: v.url,
  }));
  console.log("loaded views", views);
  return {
    views: views,
  };
}

function createWorkspaceView(
  state: ViewState,
  { payload }: CreateWorkspaceViewAction
): ViewState {
  let views = state.views || [];
  const index = views.findIndex((v) => v.containerId === payload.containerId);
  if (index !== -1 && views[index].viewId) {
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
    views,
  };
}

function updateWorkspaceView(
  state: ViewState,
  { payload }: UpdateWorkspaceViewAction
): ViewState {
  const views = state.views || [];

  return {
    ...state,
    views: views.map((v) => {
      if (
        v.containerId === payload.containerId ||
        v.viewId === payload.viewId
      ) {
        return { ...v, ...payload };
      }
      return v;
    }),
  };
}
