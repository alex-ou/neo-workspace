import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.less";
import { registerEventHandlers } from "./utils/event-handler";

registerEventHandlers();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
