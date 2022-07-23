import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { useEffect, useReducer, useState } from "react";
import { DndProvider } from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch";
import {
  MosaicWithoutDragDropContext,
  MosaicZeroState,
} from "react-mosaic-component";
import "react-mosaic-component/react-mosaic-component.css";
import { AppContext } from "../app-context";
import { reducer } from "../store";
import { viewReducer } from "../store/view-state";
import { createMosaicNode } from "../utils/mosaic-node";
import { defaultViewManager } from "../utils/view-manager";
import Sidebar from "./Sidebar";
import View from "./View";
import WindowToolbar from "./WindowToolbar";

function App() {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);

  const [state, dispatch] = useReducer(reducer, { workspaces: [] });
  const [viewState, dispatchViewAction] = useReducer(viewReducer, {
    views: [],
  });

  useEffect(() => {
    dispatch({ type: "load-workspace" });
    dispatchViewAction({ type: "load-views" });
  }, []);

  useEffect(() => {
    window.unity1.view.onNavigate((viewInfo) => {
      console.log("received onNavigate", viewInfo);
      dispatchViewAction({
        type: "update-workspace-view",
        payload: { ...viewInfo },
      });
    });
  }, [dispatchViewAction]);
  const toggleSidebar = () => setSidebarVisible((v) => !v);
  return (
    <AppContext.Provider value={{}}>
      <WindowToolbar onToggleSidebar={toggleSidebar} />
      <div id="u-layout">
        <MosaicWithoutDragDropContext<string>
          zeroStateView={<MosaicZeroState createNode={createMosaicNode} />}
          renderTile={(id, path) => (
            <View
              views={viewState.views}
              dispatch={dispatchViewAction}
              viewManager={defaultViewManager}
              id={id}
              path={path}
            />
          )}
          value={state.activeWorkspace?.layout || null}
          onChange={(node) => {
            console.log("tree changed");
            dispatch({
              type: "update-active-workspace",
              payload: {
                ...state.activeWorkspace!,
                layout: node,
              },
            });
          }}
        />
        {sidebarVisible && (
          <Sidebar
            workspaces={state.workspaces}
            activeWorkspace={state.activeWorkspace!}
            dispatch={dispatch}
            onClose={toggleSidebar}
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
