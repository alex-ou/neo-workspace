import {
  Button,
  ButtonGroup,
  Classes,
  Collapse,
  Icon,
  Menu,
} from "@blueprintjs/core";
import { MenuItem2, Popover2 } from "@blueprintjs/popover2";
import { css } from "@emotion/css";
import { useState } from "react";
import { Workspace } from "../../store/workspace";
import Favicon from "./Favicon";
const MAX_WORKSPACE_NAME_LEN = 40;
interface WorkspaceListProps {
  startIndex: number;
  groupName: "pinned" | "unpinned";
  workspaces: Workspace[];
  onRemove: (workspace: Workspace) => void;
  onRename: (workspace: Workspace) => void;
  onSwitch: (workspace: Workspace) => void;
  onPin?: (workspace: Workspace) => void;
  onUnpin?: (workspace: Workspace) => void;
  onToggleAddressBar?: (workspace: Workspace) => void;
}

const classes = {
  menuItem: css`
    display: flex;
    justify-content: space-between;
  `,
};
export function WorkspaceList(props: WorkspaceListProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <>
      <Button
        minimal
        active
        small
        icon={isExpanded ? "caret-down" : "caret-right"}
        onClick={() => setIsExpanded((v) => !v)}
        fill
        alignText="left"
      >
        {props.groupName === "pinned" ? "Pinned" : "Other"}
      </Button>
      <Collapse isOpen={isExpanded}>
        <ButtonGroup
          fill
          vertical
          className={css`
            height: auto !important;
            padding: 0;
          `}
        >
          {props.workspaces.map((w, i) => (
            <Button
              key={w.id}
              title={w.name}
              minimal
              large
              alignText="left"
              active={w.isActive}
              intent={w.isActive ? "primary" : "none"}
              onClick={() => props.onSwitch(w)}
            >
              <span
                className={css`
                  display: flex;
                `}
              >
                <span
                  className={css`
                    display: flex;
                    align-items: center;
                    flex: 1;
                    img {
                      margin-right: 2px;
                    }
                  `}
                >
                  <span className={Classes.TEXT_LARGE}>
                    {w.name.slice(0, MAX_WORKSPACE_NAME_LEN)}
                  </span>
                </span>
                <Popover2
                  className={css`
                    flex: 0 !important;
                  `}
                  position="bottom-left"
                  modifiers={{ arrow: { enabled: true } }}
                  content={
                    <Menu className={Classes.ELEVATION_2}>
                      {props.groupName === "unpinned" && (
                        <MenuItem2
                          icon="pin"
                          text={<span className={classes.menuItem}>Pin</span>}
                          onClick={() => props.onPin?.(w)}
                        />
                      )}
                      {props.groupName === "pinned" && (
                        <MenuItem2
                          icon="unpin"
                          text={<span className={classes.menuItem}>Unpin</span>}
                          onClick={() => props.onUnpin?.(w)}
                        />
                      )}

                      <MenuItem2
                        icon="edit"
                        text={
                          <span className={classes.menuItem}>
                            Rename
                            <span className={Classes.TEXT_MUTED}>Ctrl+E</span>
                          </span>
                        }
                        onClick={() => props.onRename(w)}
                      />
                      <MenuItem2
                        icon="cross"
                        text={
                          <span className={classes.menuItem}>
                            Delete
                            <span className={Classes.TEXT_MUTED}>Ctrl+W</span>
                          </span>
                        }
                        onClick={() => props.onRemove(w)}
                      />
                      <MenuItem2
                        text={
                          <span
                            className={
                              classes.menuItem +
                              " " +
                              css`
                                margin-left: 24px;
                              `
                            }
                          >
                            {w.isAddressBarHidden
                              ? "Show address bar"
                              : "Hide address bar"}
                          </span>
                        }
                        onClick={() => props.onToggleAddressBar?.(w)}
                      />
                    </Menu>
                  }
                >
                  <Button minimal small icon="more"></Button>
                </Popover2>
              </span>
              <div
                className={[
                  Classes.TEXT_MUTED,
                  Classes.TEXT_SMALL,
                  css`
                    display: flex;
                    justify-content: space-between;
                    margin-top: 4px;
                  `,
                ].join(" ")}
              >
                <span>
                  {w.views.length} pane{w.views.length > 1 ? "s" : ""}
                </span>
                {props.startIndex + i + 1 < 10 && (
                  <span>Ctrl+{props.startIndex + i + 1}</span>
                )}
              </div>
            </Button>
          ))}
        </ButtonGroup>
      </Collapse>
    </>
  );
}
