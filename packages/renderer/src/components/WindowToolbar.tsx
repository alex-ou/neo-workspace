import { Button, ButtonGroup, Classes, Divider, Icon } from "@blueprintjs/core";
import { css } from "@emotion/css";
import { useEffect, useState } from "react";
import { ReactComponent as Logo } from "../assets/logo.svg";

export interface WindowToolbarProps {
  onToggleSidebar: () => void;
}
function WindowToolbar(props: WindowToolbarProps) {
  const [darkTheme, setDarkTheme] = useState(
    document.getElementById("root")!.classList.contains(Classes.DARK)
  );

  useEffect(() => {
    document.getElementById("root")!.classList.toggle(Classes.DARK, darkTheme);
    document
      .querySelector(".mosaic-blueprint-theme")!
      .classList.toggle(Classes.DARK, darkTheme);
  }, [darkTheme]);

  return (
    <div
      id="neo-toolbar"
      className={css`
        width: var(--neo-titlebar-width);
        height: var(--neo-titlebar-height);
        display: flex;
        align-items: center;
      `}
    >
      <Button
        intent="primary"
        minimal
        icon="menu"
        onClick={() => window.neonav.application.showAppMenu()}
      />

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
          <Logo className={css``} />
          <span
            className={css`
              margin-left: 8px;
            `}
          >
            <span className="bp4-heading ">{document.title}</span>
          </span>
        </div>
      </div>

      <ButtonGroup minimal alignText="center">
        <Button
          title={darkTheme ? "Turn on light" : "Turn off light"}
          onClick={() => {
            setDarkTheme(!darkTheme);
          }}
        >
          <Icon icon={darkTheme ? "flash" : "moon"} />
        </Button>

        <Button
          title="Toggle workspace sidebar"
          onClick={() => {
            props.onToggleSidebar?.();
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
