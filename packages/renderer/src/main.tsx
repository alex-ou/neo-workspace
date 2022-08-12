import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.less";
import { registerEventHandlers } from "./utils/event-handler";

let { neonav } = window;
if (!neonav) {
  window.neonav = {
    view: {
      hideAllViews: () => Promise.resolve(),
      showAllViews: () => Promise.resolve(),
      setViewBounds: () => Promise.resolve(),
      createView: () => Promise.resolve("1"),
      destroyView: () => Promise.resolve(),
      loadViewUrl: () => Promise.resolve(),
      onNavigate: () => Promise.resolve(),
      goBack: () => Promise.resolve(),
      goForward: () => Promise.resolve(),
    },
    window: {
      maximize: () => Promise.resolve(),
      minimize: () => Promise.resolve(),
      unmaximize: () => Promise.resolve(),
      close: () => Promise.resolve(),
      getState: () => Promise.resolve({ minimized: false, maximized: false }),
    },
    passwordService: {
      autofillMatched: () => {},
      onAutoFill: () => {},
      onFormFilled: () => {},
      getCredentials: () => Promise.resolve([]),
      deleteCredential: () => Promise.resolve(),
      saveCredential: () => Promise.resolve(),
    },
    application: {
      onContextMenuCommand: () => {},
      showAppMenu: () => Promise.resolve(),
    },
  };
}

registerEventHandlers();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
