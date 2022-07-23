import { Tab, Tabs, InputGroup, Button } from "@blueprintjs/core";
import { css } from "@emotion/css";
import { useContext, useEffect, useState } from "react";
import {
  getAndAssertNodeAtPathExists,
  MosaicContext,
  MosaicWindowContext,
} from "react-mosaic-component";
import { ViewAction } from "../store/view-state";
import { WorkspaceView } from "../store/Workspace";
import { ViewManager } from "../utils/view-manager";

export interface ToolbarProps {
  view?: WorkspaceView;
  viewManager: ViewManager;
  dispatch: React.Dispatch<ViewAction>;
}

function validateUrl(value: string) {
  return /^(?:(?:(?:https?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  );
}
function Toolbar(props: ToolbarProps) {
  const { mosaicWindowActions } = useContext(MosaicWindowContext);
  const { mosaicActions } = useContext(MosaicContext);
  const { view, viewManager, dispatch } = props;

  const onURLChange = (value: string) => {
    const url =
      value && validateUrl(value)
        ? value
        : `https://www.google.com/search?q=${encodeURI(value)}`;

    props.dispatch({
      type: "update-workspace-view",
      payload: {
        ...props.view,
        url,
      },
    });
    props.viewManager.loadViewUrl(props.view!.containerId, url);
  };
  return (
    <div
      className={css`
        width: 100%;
        padding: 2px;
        display: flex;
        align-items: center;
      `}
    >
      <Tabs
        className={css`
          margin: 1px;
        `}
        selectedTabId="2"
      >
        <Tab id="1">Window</Tab>
      </Tabs>
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
            window.unity1.view.goBack(view!.viewId);
          }}
        ></Button>
        <Button
          title="Click to go forward"
          icon="arrow-right"
          disabled={!view?.canGoForward}
          minimal
          onClick={() => {
            window.unity1.view.goForward(view!.viewId);
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
          className={css`
            width: 100%;
          `}
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
        />
      </div>
      <div
        className={css`
          margin: 2px 4px;
        `}
      >
        <Button
          title="Split window vertically"
          icon="add-row-bottom"
          minimal
          onClick={() => {
            const path = mosaicWindowActions.getPath();
            mosaicActions.replaceWith(path, {
              direction: "column",
              second: crypto.randomUUID(),
              first: getAndAssertNodeAtPathExists(
                mosaicActions.getRoot(),
                path
              ),
            });
          }}
        ></Button>
        <Button
          title="Split window horizontally"
          icon="add-column-right"
          minimal
          onClick={() => {
            const path = mosaicWindowActions.getPath();
            mosaicActions.replaceWith(path, {
              direction: "row",
              second: crypto.randomUUID(),
              first: getAndAssertNodeAtPathExists(
                mosaicActions.getRoot(),
                path
              ),
            });
          }}
        ></Button>
        <Button
          title="Expand"
          icon="maximize"
          minimal
          onClick={() => {
            mosaicActions.expand(mosaicWindowActions.getPath());
          }}
        ></Button>
        <Button
          title="Close Window"
          icon="cross"
          minimal
          onClick={() => {
            mosaicActions.remove(mosaicWindowActions.getPath());
          }}
        ></Button>
      </div>
    </div>
  );
}
export default Toolbar;
