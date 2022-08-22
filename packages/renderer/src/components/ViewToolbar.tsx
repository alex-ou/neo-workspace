import { Button, InputGroup, Spinner } from "@blueprintjs/core";
import { css } from "@emotion/css";
import { dropRight } from "lodash";
import { useContext, useRef } from "react";
import {
  getAndAssertNodeAtPathExists,
  getNodeAtPath,
  MosaicBranch,
  MosaicContext,
  MosaicDirection,
  MosaicParent,
  MosaicWindowContext,
} from "react-mosaic-component";
import { AppAction } from "../store";
import { WorkspaceView } from "../store/workspace";
import { useViewCommands } from "../utils/event-handler";
import { createMosaicNode } from "../utils/mosaic-node";
import { parseAddressBarInput } from "../utils/search-engine";
import { ViewManager } from "../utils/view-manager";

export interface ToolbarProps {
  view?: WorkspaceView;
  viewManager: ViewManager;
  path: MosaicBranch[];
  dispatch: React.Dispatch<AppAction>;
}

function Toolbar(props: ToolbarProps) {
  const { mosaicWindowActions } = useContext(MosaicWindowContext);
  const { mosaicActions } = useContext(MosaicContext);
  const { view, viewManager, dispatch } = props;

  const inputRef = useRef<HTMLInputElement>();
  const onURLChange = (value: string) => {
    if (!value) {
      return;
    }

    const url = parseAddressBarInput(value);
    dispatch({
      type: "update-workspace-view",
      payload: {
        ...props.view,
        url,
      },
    });
    viewManager.loadViewUrl(props.view!.containerId, url);
  };

  const createNewMosaicWindow = (direction: MosaicDirection) => {
    const newNode = createMosaicNode();
    const path = mosaicWindowActions.getPath();
    mosaicActions.replaceWith(path, {
      direction,
      first: getAndAssertNodeAtPathExists(mosaicActions.getRoot(), path),
      second: newNode,
    });
    return newNode;
  };

  useViewCommands({
    openUrl: ({ commandData }) => {
      if (commandData.viewId && commandData.viewId === view?.viewId) {
        const newNode = createNewMosaicWindow(
          commandData.location === "right" ? "row" : "column"
        );
        dispatch({
          type: "create-workspace-view",
          payload: {
            containerId: newNode,
            url: commandData.url,
          },
        });
      }
    },
  });
  const parentNode = getNodeAtPath(
    mosaicActions.getRoot(),
    dropRight(props.path)
  ) as MosaicParent<string>;
  const isMaximised =
    parentNode.splitPercentage === 0 || parentNode.splitPercentage === 100;

  return (
    <div
      className={css`
        width: 100%;
        padding: 2px;
        display: flex;
        align-items: center;
      `}
    >
      {mosaicWindowActions.connectDragSource(
        <div>
          <Button
            className={css`
              cursor: move;
            `}
            title="Drag pane to a new location"
            minimal
            icon="drag-handle-horizontal"
          ></Button>
        </div>
      )}
      <div
        className={css`
          margin-left: 2px;
        `}
      >
        <Button
          title="Click to go back"
          icon="arrow-left"
          disabled={!view?.canGoBack}
          minimal
          onClick={() => {
            viewManager.goBack(view?.containerId || "");
          }}
        ></Button>
        <Button
          title="Click to go forward"
          icon="arrow-right"
          disabled={!view?.canGoForward}
          minimal
          onClick={() => {
            viewManager.goForward(view?.containerId || "");
          }}
        ></Button>
      </div>
      <div
        className={css`
          margin-left: 8px;
          display: inline-block;
          flex: 1;
        `}
      >
        <InputGroup
          small
          autoFocus
          className={css`
            width: 100%;
          `}
          //@ts-ignore
          inputRef={inputRef}
          onFocus={() => {
            inputRef.current?.select();
          }}
          onDrag={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          value={props.view?.url || ""}
          onChange={(event) => {
            props.dispatch({
              type: "update-workspace-view",
              payload: {
                ...props.view,
                url: event.target.value,
              },
            });
          }}
          round
          placeholder="Search or type a URL"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onURLChange(event.target.value);
            }
          }}
          rightElement={view?.isLoading ? <Spinner size={16} /> : undefined}
        />
      </div>
      <div
        className={css`
          margin: 2px 4px;
        `}
      >
        <Button
          title="Split vertically"
          icon="add-row-bottom"
          minimal
          onClick={() => createNewMosaicWindow("column")}
        ></Button>
        <Button
          title="Split horizontally"
          icon="add-column-right"
          minimal
          onClick={() => createNewMosaicWindow("row")}
        ></Button>
        <Button
          title={isMaximised ? "Restore" : "Maximize"}
          icon={isMaximised ? "minimize" : "maximize"}
          minimal
          onClick={() => {
            mosaicActions.expand(
              mosaicWindowActions.getPath(),
              isMaximised ? 50 : 100
            );
          }}
        ></Button>
        <Button
          title="Close"
          icon="cross"
          minimal
          onClick={() => {
            viewManager.destroyView(view?.containerId || "");
            mosaicActions.remove(mosaicWindowActions.getPath());
          }}
        ></Button>
      </div>
    </div>
  );
}
export default Toolbar;
