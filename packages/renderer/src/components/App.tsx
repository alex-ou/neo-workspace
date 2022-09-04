import { Classes } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import { css } from "@emotion/css";

import { useEffect, useReducer, useState } from "react";
import { DndProvider } from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch";
import { MosaicWithoutDragDropContext } from "react-mosaic-component";
import "react-mosaic-component/react-mosaic-component.css";
import { ViewInfo } from "../../../preload/renderer-api/types";
import { AppContext } from "../app-context";
import { useReaderModeReady } from "../hooks/reader-mode";
import { useWorkspaceCommandHandling } from "../hooks/view-command";
import { useWindowState } from "../hooks/window-state";
import { reducer } from "../store";
import { createMosaicNode } from "../utils/mosaic-node";
import { defaultViewManager } from "../utils/view-manager";
import Sidebar from "./sidebar/Sidebar";
import View from "./View";
import WindowToolbar from "./WindowToolbar";
import ZeroState from "./ZeroState";

function App() {
  const { isFullscreen } = useWindowState();

  const [state, dispatch] = useReducer(reducer, {
    workspaces: [],
    removedWorkspaces: [],
    pinnedWorkspaceIds: [],
    currentTheme: document
      .getElementById("root")!
      .classList.contains(Classes.DARK)
      ? "dark"
      : "light",
    isSidebarVisible: true,
  });

  const activeWorkspace = state.workspaces.find((w) => w.isActive);

  useEffect(() => {
    dispatch({ type: "load-workspace" });

    defaultViewManager.onViewUpdate((viewInfo: ViewInfo) => {
      dispatch({ type: "update-workspace-view", payload: { ...viewInfo } });
    });
  }, []);

  useWorkspaceCommandHandling(state.workspaces, dispatch);
  useReaderModeReady(dispatch);

  return (
    <AppContext.Provider value={{}}>
      {!isFullscreen && (
        <WindowToolbar
          currentTheme={state.currentTheme}
          activeWorkspace={activeWorkspace}
          dispatch={dispatch}
        />
      )}
      <div
        id="neo-layout"
        className={css`
          height: calc(
            100% - ${isFullscreen ? "0px" : "var(--neo-titlebar-height)"}
          );
          display: flex;
          .mosaic-tile {
            margin: ${isFullscreen ? 0 : 3}px;
          }
        `}
      >
        <MosaicWithoutDragDropContext<string>
          blueprintNamespace="bp4"
          zeroStateView={<ZeroState createNode={createMosaicNode} />}
          renderTile={(id, path) => {
            return (
              <View
                showToolbar={
                  !isFullscreen && !activeWorkspace?.isAddressBarHidden
                }
                activeWorkspace={activeWorkspace}
                dispatch={dispatch}
                viewManager={defaultViewManager}
                id={id}
                path={path}
              />
            );
          }}
          value={activeWorkspace?.layout || null}
          onChange={(node) => {
            dispatch({
              type: "update-active-workspace",
              payload: {
                layout: node,
              },
            });
          }}
        />
        {state.isSidebarVisible && !isFullscreen && (
          <Sidebar
            pinnedWorkspaceIds={state.pinnedWorkspaceIds}
            workspaces={state.workspaces}
            dispatch={dispatch}
          />
        )}
      </div>
    </AppContext.Provider>
  );
}

function AppWithDnD() {
  return (
    // @ts-ignore
    <DndProvider options={HTML5toTouch}>
      <App />
    </DndProvider>
  );
}
export default AppWithDnD;
