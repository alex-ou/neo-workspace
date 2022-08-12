import {
  Button,
  Callout,
  Card,
  Classes,
  Colors,
  Dialog,
  Divider,
  Icon,
  InputGroup,
} from "@blueprintjs/core";
import { css } from "@emotion/css";
import { useState } from "react";
import { AppAction } from "../store";
import { Workspace } from "../store/workspace";
import { WorkspaceList } from "./WorkspaceList";
import config from "../../../../package.json";
interface SidebarProps {
  workspaces: Workspace[];
  dispatch: React.Dispatch<AppAction>;
  onClose: () => void;
}

function Sidebar(props: SidebarProps) {
  const { workspaces, dispatch } = props;
  const activeWorkspace = workspaces.find((w) => w.isActive);

  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [workspaceEditing, setWorkspaceEditing] = useState<Workspace>();

  return (
    <div
      id="u-sidebar"
      className={css`
        width: 360px;
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
          <Button minimal small icon="cross" onClick={props.onClose}></Button>
        </div>
        <Divider
          className={css`
            margin: 0;
          `}
        />
        <Callout>
          <Button
            outlined
            intent="primary"
            icon="add"
            onClick={() => {
              setDialogOpen(true);
              setWorkspaceEditing(undefined);
            }}
          >
            Create new workspace
          </Button>
        </Callout>
        <Dialog
          className={css`
            margin: 8px;
          `}
          title={!workspaceEditing ? "Create new workspace" : "Edit workspace"}
          isOpen={isDialogOpen}
          canOutsideClickClose
          usePortal={false}
          onClose={() => {
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
                intent="primary"
                onClick={() => {
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
                Save
              </Button>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            </div>
          </div>
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
      </Card>
      <div
        className={css`
          position: absolute;
          bottom: 10px;
          left: 8px;
          right: 8px;
          display: flex;
          justify-content: space-between;
        `}
      >
        <a href="mailto:support@neonav.co">
          <Icon color={Colors.BLUE2} icon="envelope"></Icon> Email us
        </a>
        v{config.version}
      </div>
    </div>
  );
}
export default Sidebar;
