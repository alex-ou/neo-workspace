import { Button, ButtonGroup, Divider, Icon, Classes } from "@blueprintjs/core";
import { css } from "@emotion/css";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { WindowState } from "../../../preload/renderer-api/types";
import { ReactComponent as Logo } from "../assets/logo.svg";

export interface WindowToolbarProps {
  onToggleSidebar: () => void;
}
function WindowToolbar(props: WindowToolbarProps) {
  const { unity1 } = window;
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  const [darkTheme, setDarkTheme] = useState(
    document.getElementById("root")!.classList.contains(Classes.DARK)
  );

  useEffect(() => {
    document.getElementById("root")!.classList.toggle(Classes.DARK, darkTheme);
    document
      .querySelector(".mosaic-blueprint-theme")!
      .classList.toggle(Classes.DARK, darkTheme);
  }, [darkTheme]);

  useEffect(() => {
    const setState = () =>
      unity1.window.getState().then((state: WindowState) => {
        setIsMaximized(state.maximized);
      });
    const resizeHandler = debounce(() => setState(), 500);

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div
      id="u-toolbar"
      className={css`
        display: flex;
        margin-left: 8px;
        align-items: center;
      `}
    >
      <div
        className={css`
          display: flex;
          -webkit-app-region: drag;
          flex: 1;
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

      <ButtonGroup minimal alignText="center">
        <Button
          title={darkTheme ? "Turn on light" : "Turn off light"}
          onClick={() => {
            setDarkTheme(!darkTheme);
          }}
        >
          <Icon icon={darkTheme ? "flash" : "moon"} />
        </Button>

        <Divider></Divider>
        <Button
          title="Toggle layout editing sidebar"
          onClick={() => {
            props.onToggleSidebar?.();
          }}
        >
          <Icon icon="panel-stats" />
        </Button>

        <Divider></Divider>

        <Button
          onClick={() => {
            unity1.window.minimize();
          }}
        >
          <Icon icon="minus" />
        </Button>

        <Button
          onClick={() => {
            isMaximized ? unity1.window.unmaximize() : unity1.window.maximize();
            setIsMaximized(!isMaximized);
          }}
        >
          <Icon
            className={css`
              svg {
                margin-bottom: 2px;
              }
            `}
            size={12}
            icon={isMaximized ? "duplicate" : "square"}
          />
        </Button>
        <Button
          onClick={() => {
            unity1.window.close();
          }}
        >
          <Icon icon="cross" />
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default WindowToolbar;
