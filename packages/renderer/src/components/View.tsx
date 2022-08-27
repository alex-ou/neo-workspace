import { Colors } from "@blueprintjs/core";
import { css } from "@emotion/css";
import React, { useState } from "react";
import { MosaicBranch, MosaicWindow } from "react-mosaic-component";
import { AppAction } from "../store";
import { Workspace } from "../store/workspace";
import { getNeoComponent } from "../utils/address-input";
import { createMosaicNode } from "../utils/mosaic-node";
import { ViewManager } from "../utils/view-manager";
import Error from "./Error";
import KeyboardShortcuts from "./KeyboardShortcuts";
import SavePasswordBar from "./SavePasswordBar";
import Settings from "./settings/Settings";
import ViewToolbar from "./ViewToolbar";

interface ViewProps {
  viewManager: ViewManager;
  id: string;
  path: MosaicBranch[];
  activeWorkspace?: Workspace;
  dispatch: React.Dispatch<AppAction>;
}
function View({ id, path, viewManager, activeWorkspace, dispatch }: ViewProps) {
  const currentView = (activeWorkspace?.views || []).find(
    (v) => v.containerId === id
  );

  const neoComponent = getNeoComponent(currentView?.url || "");

  const [isCapturingPassword, setIsCapturingPassword] = useState(false);
  const passwordBarHeight = isCapturingPassword ? "44px" : "0px";

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const elem = containerRef.current;
    if (neoComponent || !elem) {
      return;
    }

    viewManager.createView(id, elem, currentView?.url).then((viewInfo) => {
      dispatch({
        type: "create-workspace-view",
        payload: {
          containerId: id,
          viewId: viewInfo.viewId,
          url: currentView?.url,
        },
      });
    });
  }, [containerRef]);

  return (
    // @ts-ignore
    <MosaicWindow<string>
      className={css`
        border: 2px solid
          ${currentView?.isFocused ? Colors.BLUE4 : "transparent"};
      `}
      path={path}
      draggable={false}
      createNode={createMosaicNode}
      renderToolbar={() => (
        <div
          className={css`
            width: 100%;
            min-width: 270px;
          `}
        >
          <ViewToolbar path={path} dispatch={dispatch} view={currentView} />
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
          {currentView?.error && <Error error={currentView.error} />}
          {neoComponent === "settings" && <Settings />}
          {neoComponent === "keyboard-shortcuts" && <KeyboardShortcuts />}
        </div>
      </div>
    </MosaicWindow>
  );
}

export default View;
