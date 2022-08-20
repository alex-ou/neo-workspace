import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

import { useEffect, useReducer, useState } from "react";
import { DndProvider } from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch";
import { MosaicWithoutDragDropContext } from "react-mosaic-component";
import "react-mosaic-component/react-mosaic-component.css";
import { AppContext } from "../app-context";
import { reducer } from "../store";
import { createMosaicNode } from "../utils/mosaic-node";
import { defaultViewManager } from "../utils/view-manager";
import Settings from "./settings/Settings";
import Sidebar from "./sidebar/Sidebar";
import View from "./View";
import WindowToolbar from "./WindowToolbar";
import ZeroState from "./ZeroState";

function App() {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

  const [state, dispatch] = useReducer(reducer, { workspaces: [] });

  const activeWorkspace = state.workspaces.find((w) => w.isActive);

  useEffect(() => {
    dispatch({ type: "load-workspace" });

    window.neonav.view.onUpdate((viewInfo) => {
      console.log("received onUpdate", viewInfo);
      dispatch({ type: "update-workspace-view", payload: { ...viewInfo } });

      if (viewInfo.error) {
        window.neonav.view.hideView(viewInfo.viewId);
      } else {
        window.neonav.view.showView(viewInfo.viewId);
      }
    });
  }, []);

  const toggleSidebar = () => setSidebarVisible((v) => !v);
  return (
    <AppContext.Provider value={{}}>
      <WindowToolbar onToggleSidebar={toggleSidebar} />
      <div id="neo-layout">
        <Settings />
        <MosaicWithoutDragDropContext<string>
          zeroStateView={<ZeroState createNode={createMosaicNode} />}
          renderTile={(id, path) => {
            return (
              <View
                views={activeWorkspace?.views || []}
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
        {sidebarVisible && (
          <Sidebar
            workspaces={state.workspaces}
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
