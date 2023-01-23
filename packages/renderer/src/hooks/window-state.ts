import { useEffect, useState } from "react";
import { WindowState } from "../../../preload/renderer-api/types";
import debounce from "lodash/debounce";

export function useWindowState(): WindowState {
  const [windowState, setWindowState] = useState<WindowState>({
    isMinimized: false,
    isFullscreen: false,
    isMaximized: false,
  });
  useEffect(() => {
    const setState = () =>
      window.neonav.window.getState().then((state: WindowState) => {
        setWindowState(state);
      });
    const resizeHandler = debounce(() => setState(), 500);

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);
  return windowState;
}
