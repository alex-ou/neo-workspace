import { Button, ButtonGroup, Classes, Menu } from "@blueprintjs/core";
import { MenuItem2, Popover2 } from "@blueprintjs/popover2";
import { css } from "@emotion/css";
import { Workspace } from "../../store/workspace";

interface WorkspaceListProps {
  workspaces: Workspace[];
  onRemove: (workspace: Workspace) => void;
  onRename: (workspace: Workspace) => void;
  onSwitch: (workspace: Workspace) => void;
}

export function WorkspaceList(props: WorkspaceListProps) {
  return (
    <ButtonGroup
      fill
      vertical
      className={css`
        height: auto !important;
        margin-top: 8px;
        padding: 0 8px;
      `}
    >
      {props.workspaces.map((w) => (
        <Button
          minimal
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
              {w.name}
            </span>
            <Popover2
              className={css`
                flex: 0 !important;
              `}
              position="bottom-left"
              modifiers={{ arrow: { enabled: true } }}
              content={
                <Menu className={Classes.ELEVATION_2}>
                  <MenuItem2
                    icon="edit"
                    text="Rename"
                    onClick={() => props.onRename(w)}
                  />
                  <MenuItem2
                    icon="cross"
                    text="Delete"
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
  );
}
