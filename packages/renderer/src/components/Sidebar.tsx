import {
  Button,
  Callout,
  Card,
  Classes,
  Divider,
  InputGroup,
  Radio,
  RadioGroup,
} from "@blueprintjs/core";
import { css } from "@emotion/css";
import { useState } from "react";
import { AppAction } from "../store";
import { Workspace } from "../store/Workspace";

interface SidebarProps {
  workspaces: Workspace[];
  dispatch: React.Dispatch<AppAction>;
  onClose: () => void;
}

function Sidebar(props: SidebarProps) {
  const [name, setName] = useState<string>("");

  const { workspaces, dispatch } = props;

  const activeWorkspace = workspaces.find((w) => w.isActive);

  return (
    <div
      id="u-sidebar"
      className={css`
        width: 360px;
        height: 100%;

        margin: 0;
        padding: 6px 0px;
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
        <Divider />
        <Callout>
          <InputGroup
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Type a workspace name"
          ></InputGroup>
          <Button
            className={css`
              margin-top: 8px;
            `}
            icon="add"
            onClick={() => {
              if (!name) return;
              dispatch({
                type: "add-workspace",
                payload: {
                  name,
                },
              });
              setName("");
            }}
          >
            Create new workspace
          </Button>
        </Callout>
        <RadioGroup
          onChange={(event) => {
            dispatch({
              type: "switch-workspace",
              payload: { workspaceId: event.currentTarget.value },
            });
          }}
          selectedValue={activeWorkspace?.id}
          className={css`
            margin-top: 8px;
            padding: 0 8px;
          `}
        >
          {workspaces.map((w) => (
            <Radio
              className={
                Classes.CARD +
                " " +
                css`
                  padding: 2px 0;
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
              key={w.id}
              value={w.id}
            >
              <>
                <span>{w.name}</span>
                <span
                  className={css`
                    flex: 1;
                  `}
                />
                {!w.isActive && (
                  <Button
                    minimal
                    small
                    icon="cross"
                    onClick={() => {
                      dispatch({
                        type: "remove-workspace",
                        payload: {
                          workspaceId: w.id,
                        },
                      });
                    }}
                  ></Button>
                )}
              </>
            </Radio>
          ))}
        </RadioGroup>
      </Card>
    </div>
  );
}
export default Sidebar;
