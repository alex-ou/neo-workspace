import { useEffect } from "react";
import { AppAction } from "../store";
import { ReaderModeReadyDetail } from "../types";

export function useReaderModeReady(dispatch: React.Dispatch<AppAction>) {
  useEffect(() => {
    const listener = (e: CustomEvent<ReaderModeReadyDetail>) => {
      dispatch({
        type: "update-workspace-view",
        payload: {
          viewId: e.detail.viewId,
          isReaderModeReady: true,
        },
      });
    };
    document.addEventListener("readermodeready", listener);
    return () => {
      document.removeEventListener("readermodeready", listener);
    };
  }, []);
}
