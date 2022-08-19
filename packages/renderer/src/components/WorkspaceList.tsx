import { Button, Classes, Menu, Radio, RadioGroup } from "@blueprintjs/core";
import { MenuItem2, Popover2 } from "@blueprintjs/popover2";
import { css } from "@emotion/css";
import { Workspace } from "../store/workspace";

interface WorkspaceListProps {
  workspaces: Workspace[];
  onRemove: (workspace: Workspace) => void;
  onRename: (workspace: Workspace) => void;
  onSwitch: (workspaceId: string) => void;
}

export function WorkspaceList(props: WorkspaceListProps) {
  const activeWorkspace = props.workspaces.find((w) => w.isActive);

  return (
    <RadioGroup
      onChange={(event) => {
        props.onSwitch(event.currentTarget.value);
      }}
      selectedValue={activeWorkspace?.id}
      className={css`
        margin-top: 8px;
        padding: 0 8px;
      `}
    >
      {props.workspaces.map((w) => (
        <Radio
          className={
            Classes.CARD +
            " " +
            css`
              padding: 4px;
              min-height: 50px;
              display: flex;
              align-items: center;
              :not(.bp4-align-right) .bp4-control-indicator {
                margin-left: -20px;
              }
              background-color: ${w.isActive
                ? "rgba(45, 114, 210, 0.1)"
                : "transparent"};
            `
          }
          value={w.id}
        >
          <>
            <span>{w.name}</span>
            <span
              className={css`
                flex: 1;
              `}
            />
            <Popover2
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
          </>
        </Radio>
      ))}
    </RadioGroup>
  );
}
