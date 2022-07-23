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
  return {
    views: getViews(),
  };
}

function createWorkspaceView(
  state: ViewState,
  { payload }: CreateWorkspaceViewAction
): ViewState {
  const views = state.views || [];
  if (views.find((v) => v.containerId === payload.containerId)) {
    return state;
  }

  return {
    ...state,
    views: views.concat(payload),
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
