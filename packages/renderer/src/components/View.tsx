import { css } from "@emotion/css";
import { debounce } from "lodash";
import React from "react";
import { MosaicBranch, MosaicWindow } from "react-mosaic-component";
import { AppAction } from "../store";
import { WorkspaceView } from "../store/Workspace";
import { ViewManager } from "../utils/view-manager";
import ViewToolbar from "./ViewToolbar";

interface ViewProps {
  viewManager: ViewManager;
  id: string;
  path: MosaicBranch[];
  views: WorkspaceView[];
  dispatch: React.Dispatch<AppAction>;
}
function View(props: ViewProps) {
  const viewManager = props.viewManager;

  const { id, path } = props;
  const currentView = props.views.find((v) => v.containerId === id);

  const debouncedFunc = debounce((elem: HTMLDivElement) => {
    if (!elem) {
      return;
    }
    viewManager.createView(id, elem, currentView?.url).then((viewInfo) => {
      props.dispatch({
        type: "create-workspace-view",
        payload: {
          containerId: id,
          viewId: viewInfo.viewId,
        },
      });
    });
  }, 200);

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    debouncedFunc(containerRef.current!);
  }, [containerRef]);

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
            min-width: 270px;
          `}
        >
          <ViewToolbar
            path={path}
            dispatch={props.dispatch}
            view={currentView}
            viewManager={viewManager}
          />
        </div>
      )}
      onDragStart={() => viewManager.hideAllViews()}
      onDragEnd={() => viewManager.showAllViews()}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>
    </MosaicWindow>
  );
}

export default View;
