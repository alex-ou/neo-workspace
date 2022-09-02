import { Button, InputGroup, Spinner } from "@blueprintjs/core";
import { css } from "@emotion/css";
import dropRight from "lodash/dropRight";
import { useContext, useEffect, useRef } from "react";
import {
  getAndAssertNodeAtPathExists,
  getNodeAtPath,
  MosaicBranch,
  MosaicContext,
  MosaicDirection,
  MosaicParent,
  MosaicWindowContext,
} from "react-mosaic-component";
import { useViewCommands } from "../hooks/view-command";
import { AppAction } from "../store";
import { WorkspaceView } from "../store/workspace";
import { parseAddressBarInput } from "../utils/address-input";
import { createMosaicNode } from "../utils/mosaic-node";
const { neonav } = window;
export interface ToolbarProps {
  view?: WorkspaceView;
  path: MosaicBranch[];
  dispatch: React.Dispatch<AppAction>;
}

function Toolbar(props: ToolbarProps) {
  const { mosaicWindowActions } = useContext(MosaicWindowContext);
  const { mosaicActions } = useContext(MosaicContext);
  const { view, dispatch } = props;

  const urlInputRef = useRef<HTMLInputElement>();
  const onURLChange = (value: string) => {
    if (!value) {
      return;
    }
    const url = parseAddressBarInput(value);
    neonav.view.loadViewUrl({ id: view!.viewId!, url });
    dispatch({
      type: "update-workspace-view",
      payload: {
        ...props.view,
        url,
      },
    });
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

  const splitWindow = (direction: MosaicDirection, args: any) => {
    const newNode = createNewMosaicWindow(direction);
    dispatch({
      type: "create-workspace-view",
      payload: {
        containerId: newNode,
        ...args,
      },
    });
  };

  const removeWindow = () => {
    mosaicActions.remove(mosaicWindowActions.getPath());
    dispatch({
      type: "remove-workspace-view",
      payload: {
        containerId: view!.containerId,
      },
    });
  };

  useEffect(() => {
    if (view?.isFocused && !view?.url) {
      urlInputRef.current!.focus();
    }
  }, [view?.isFocused]);

  useViewCommands(
    {
      openUrl: ({ commandData }) => {
        // open lins to the right and bottom
        if (commandData.viewId && commandData.viewId === view?.viewId) {
          splitWindow(commandData.location === "right" ? "row" : "column", {
            url: commandData.url,
          });
        }
      },
      focusAddressBar: () => {
        if (view?.isFocused) {
          neonav.window.focus().then(() => {
            urlInputRef.current!.focus();
          });
        }
      },
      splitWindowHorizontally: () => {
        if (view?.isFocused) {
          splitWindow("row", { isFocused: true });
        }
      },
      splitWindowVertically: () => {
        if (view?.isFocused) {
          splitWindow("column", { isFocused: true });
        }
      },
      closeFocusingWindow: () => {
        if (view?.isFocused) {
          removeWindow();
        }
      },
    },
    [urlInputRef, view?.viewId]
  );

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
            neonav.view.goBack(view?.viewId || "");
          }}
        ></Button>
        <Button
          title="Click to go forward"
          icon="arrow-right"
          disabled={!view?.canGoForward}
          minimal
          onClick={() => {
            neonav.view.goForward(view?.viewId || "");
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
          inputRef={urlInputRef}
          onFocus={() => {
            props.dispatch({
              type: "update-workspace-view",
              payload: { ...props.view, isFocused: true },
            });

            urlInputRef.current?.select();
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
        {!isMaximised && (
          <>
            {" "}
            <Button
              title="Split vertically"
              icon="add-row-bottom"
              minimal
              onClick={() => splitWindow("column", { isFocused: true })}
            ></Button>
            <Button
              title="Split horizontally"
              icon="add-column-right"
              minimal
              onClick={() => splitWindow("row", { isFocused: true })}
            ></Button>
          </>
        )}
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
          onClick={removeWindow}
        ></Button>
      </div>
    </div>
  );
}
export default Toolbar;
