import { MosaicBranch, MosaicWindow } from "react-mosaic-component";
import ViewToolbar from "./ViewToolbar";
import { ViewManager } from "../utils/view-manager";
import { css } from "@emotion/css";
import { ViewAction } from "../store/view-state";
import { WorkspaceView } from "../store/Workspace";

interface ViewProps {
  viewManager: ViewManager;
  id: string;
  path: MosaicBranch[];
  views: WorkspaceView[];
  dispatch: React.Dispatch<ViewAction>;
}
function View(props: ViewProps) {
  const viewManager = props.viewManager;

  const { id, path } = props;
  const currentView = props.views.find((v) => v.containerId === id);

  const setContainerRef = (elem: HTMLDivElement) => {
    if (elem) {
      viewManager.createView(id, elem, currentView?.url).then((viewInfo) => {
        props.dispatch({
          type: "create-workspace-view",
          payload: {
            containerId: id,
            viewId: viewInfo.viewId,
          },
        });
      });
    }
  };

  return (
    // @ts-ignore
    <MosaicWindow<string>
      path={path}
      draggable={false}
      createNode={() => crypto.randomUUID()}
      renderToolbar={() => (
        <div
          className={css`
            width: 100%;
          `}
        >
          <ViewToolbar
            dispatch={props.dispatch}
            view={currentView}
            viewManager={viewManager}
          />
        </div>
      )}
      onDragStart={() => viewManager.hideAllViews()}
      onDragEnd={() => viewManager.showAllViews()}
    >
      <div
        ref={setContainerRef}
        style={{ width: "100%", height: "100%" }}
      ></div>
    </MosaicWindow>
  );
}

export default View;
