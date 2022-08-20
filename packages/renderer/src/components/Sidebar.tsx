import {
  Button,
  Callout,
  Card,
  Classes,
  Dialog,
  Divider,
  InputGroup,
} from "@blueprintjs/core";
import { css } from "@emotion/css";
import { useState } from "react";
import { AppAction } from "../store";
import { Workspace } from "../store/workspace";
import { WorkspaceList } from "./WorkspaceList";
interface SidebarProps {
  workspaces: Workspace[];
  dispatch: React.Dispatch<AppAction>;
  onClose: () => void;
}

function Sidebar(props: SidebarProps) {
  const { dispatch } = props;

  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [workspaceEditing, setWorkspaceEditing] = useState<Workspace>();

  return (
    <div
      id="neo-sidebar"
      className={css`
        width: 300px;
        height: 100%;
        position: relative;
        margin: 0;
        padding: 6px 6px 6px 0px;
      `}
    >
      <Card
        className={css`
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        `}
      >
        <div
          className={css`
            padding: 0 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 30px;
            h4 {
              margin: 0;
            }
          `}
        >
          <h4 className={Classes.HEADING}>Workspaces</h4>
          <Button
            minimal
            icon="chevron-right"
            title="Collapse sidebar"
            onClick={props.onClose}
          ></Button>
        </div>
        <Divider
          className={css`
            margin: 0;
          `}
        />

        <Dialog
          autoFocus
          className={css`
            margin: 8px;
          `}
          title={!workspaceEditing ? "New workspace" : "Edit workspace"}
          isOpen={isDialogOpen}
          canOutsideClickClose
          usePortal={false}
          onClose={() => {
            setDialogOpen(false);
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!workspaceName) return;
              if (!workspaceEditing) {
                dispatch({
                  type: "add-workspace",
                  payload: {
                    name: workspaceName,
                  },
                });
              } else {
                dispatch({
                  type: "update-workspace",
                  payload: {
                    ...workspaceEditing,
                    name: workspaceName,
                  },
                });
              }
              setWorkspaceName("");
              setDialogOpen(false);
            }}
          >
            <div className={Classes.DIALOG_BODY}>
              <InputGroup
                autoFocus
                value={workspaceName}
                onChange={(e) => {
                  setWorkspaceName(e.target.value);
                }}
                placeholder="Type a workspace name"
              ></InputGroup>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button
                  type="submit"
                  intent="primary"
                  // onClick={() => {

                  // }}
                >
                  Save
                </Button>
                <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          </form>
        </Dialog>

        <WorkspaceList
          workspaces={props.workspaces}
          onRename={(w: Workspace) => {
            setDialogOpen(true);
            setWorkspaceEditing(w);
            setWorkspaceName(w.name);
          }}
          onSwitch={(workspaceId: string) => {
            dispatch({
              type: "switch-workspace",
              payload: { workspaceId },
            });
          }}
          onRemove={(w: Workspace) => {
            dispatch({
              type: "remove-workspace",
              payload: {
                workspaceId: w.id,
              },
            });
          }}
        ></WorkspaceList>
        <Divider />
        <Button
          minimal
          fill
          alignText="left"
          icon="plus"
          onClick={() => {
            dispatch({
              type: "add-workspace",
              payload: {
                name: "New Workspace",
              },
            });
          }}
        >
          <span
            className={css`
              width: 100%;
              display: flex;
              justify-content: space-between;
            `}
          >
            New workspace <span className={Classes.TEXT_MUTED}>(Ctrl+T)</span>
          </span>
        </Button>
      </Card>
    </div>
  );
}
export default Sidebar;
