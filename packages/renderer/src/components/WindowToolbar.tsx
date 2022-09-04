import { Button, ButtonGroup, Divider, Icon } from "@blueprintjs/core";
import { css } from "@emotion/css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { AppAction } from "../store";
import { Workspace } from "../store/workspace";

export interface WindowToolbarProps {
  activeWorkspace?: Workspace;
  currentTheme: string;
  dispatch: React.Dispatch<AppAction>;
}
function WindowToolbar(props: WindowToolbarProps) {
  const { activeWorkspace } = props;

  const isDarkTheme = props.currentTheme === "dark";

  return (
    <div
      id="neo-toolbar"
      className={css`
        margin-left: 2px;
        width: var(--neo-titlebar-width);
        height: var(--neo-titlebar-height);
        display: flex;
        align-items: center;
      `}
    >
      <Logo />

      <div
        className={css`
          display: flex;
          -webkit-app-region: drag;
          flex: 1;
          justify-content: space-around;
        `}
      >
        <div
          className={css`
            display: flex;
            align-items: center;
          `}
        >
          <span
            className={css`
              margin-left: 8px;
            `}
          >
            <span className="bp4-heading ">{activeWorkspace?.name}</span>
          </span>
        </div>
      </div>

      <ButtonGroup large minimal alignText="center">
        <Button
          minimal
          icon="more"
          onClick={() => window.neonav.application.showAppMenu()}
        />
        <Divider />

        <Button
          title={isDarkTheme ? "Turn on light" : "Turn off light"}
          onClick={() => {
            props.dispatch({
              type: "set-theme",
              payload: {
                theme: isDarkTheme ? "light" : "dark",
              },
            });
          }}
        >
          <Icon icon={isDarkTheme ? "flash" : "moon"} />
        </Button>

        <Button
          title="Toggle workspace sidebar"
          onClick={() => {
            props.dispatch({
              type: "toggle-sidebar",
            });
          }}
        >
          <Icon icon="panel-stats" />
        </Button>
        <Divider />
      </ButtonGroup>
    </div>
  );
}

export default WindowToolbar;
