import {
  Button,
  ButtonGroup,
  Classes,
  Collapse,
  Menu,
} from "@blueprintjs/core";
import { MenuItem2, Popover2 } from "@blueprintjs/popover2";
import { css } from "@emotion/css";
import { useState } from "react";
import { Workspace } from "../../store/workspace";
const MAX_WORKSPACE_NAME_LEN = 40;
interface WorkspaceListProps {
  groupName: "pinned" | "unpinned";
  workspaces: Workspace[];
  onRemove: (workspace: Workspace) => void;
  onRename: (workspace: Workspace) => void;
  onSwitch: (workspace: Workspace) => void;
  onPin?: (workspace: Workspace) => void;
  onUnpin?: (workspace: Workspace) => void;
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
            margin-bottom: 15px;
            padding: 0 8px;
          `}
        >
          {props.workspaces.map((w) => (
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
                  `}
                >
                  {w.name.slice(0, MAX_WORKSPACE_NAME_LEN)}
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
                    </Menu>
                  }
                >
                  <Button minimal small icon="more"></Button>
                </Popover2>
              </span>
            </Button>
          ))}
        </ButtonGroup>
      </Collapse>
    </>
  );
}
