import { H4, Icon } from "@blueprintjs/core";
import { css } from "@emotion/css";
import { debounce } from "lodash";
import React, { useState } from "react";
import { MosaicBranch, MosaicWindow } from "react-mosaic-component";
import { AppAction } from "../store";
import { WorkspaceView } from "../store/workspace";
import { ViewManager } from "../utils/view-manager";
import SavePasswordBar from "./SavePasswordBar";
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

  const [isCapturingPassword, setIsCapturingPassword] = useState(false);
  const passwordBarHeight = isCapturingPassword ? "44px" : "0px";

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
    setTimeout(() => debouncedFunc(containerRef.current!), 0);
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
      <div
        className={css`
          height: 100%;
        `}
      >
        <div
          className={css`
            height: ${passwordBarHeight};
            display: ${isCapturingPassword ? "block" : "none"};
          `}
        >
          <SavePasswordBar
            viewId={currentView?.viewId}
            onClose={() => {
              setIsCapturingPassword(false);
            }}
            onOpen={() => {
              setIsCapturingPassword(true);
            }}
          />
        </div>

        <div
          ref={containerRef}
          className={css`
            height: calc(100% - ${passwordBarHeight});
          `}
        >
          {currentView?.error ? (
            <div
              className={css`
                margin-top: 16px;
                display: flex;
                justify-content: space-around;
                flex-direction: column;
                align-items: center;
                gap: 4px;
              `}
            >
              <Icon icon="error" size={32} />
              <H4>Oops..!</H4>
              <b>Something went wrong. Please try again.</b>
            </div>
          ) : undefined}
        </div>
      </div>
    </MosaicWindow>
  );
}

export default View;
