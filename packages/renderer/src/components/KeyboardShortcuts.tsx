import { H2, Divider } from "@blueprintjs/core";
import { css } from "@emotion/css";
import React, { ReactNode } from "react";

const CTRL = "Ctrl";
const SHIFT = "Shift";
const ALT = "Alt";
export default function KeyboardShortcuts() {
  return (
    <div
      className={css`
        position: relative;
        height: 100%;
        padding: 16px;
      `}
    >
      <div>
        <H2>Keyboard shortcuts</H2>
      </div>

      <div
        className={css`
          height: calc(100% - 32px);
          overflow-x: auto;
          overflow-y: auto;
          width: 100%;
          box-sizing: border-box;
          padding: 2px;
          code {
            margin: 0 2px;
          }
        `}
      >
        <table className="bp4-html-table bp4-running-text bp4-html-table-bordered">
          {shortcutTable("Workspaces", [
            { name: "New workspace", keys: ["Ctrl", "T"] },
            { name: "Remove active workspace", keys: ["Ctrl", "W"] },
            {
              name: "Edit active workspace",
              keys: ["Ctrl", "E"],
              notes: "Open the renaming dialog in the sidebar",
            },
            {
              name: "Reopen previously closed workspaces in the order they were closed",
              keys: ["Ctrl", "Shift", "T"],
            },
            {
              name: (
                <span>
                  Switch to n<sup>th</sup> workspace
                </span>
              ),
              keys: ["Ctrl", "n"],
              notes: (
                <span>
                  <code>n</code> is between 1 and 9 inclusive, e.g.
                  <code>Ctrl</code>
                  <code>2</code> switches to the 2<sup>nd</sup> workspace
                </span>
              ),
            },
          ])}
          {shortcutTable("Browser panes/windows ", [
            { name: "Focus location bar", keys: [CTRL, "L"] },
            {
              name: "Split pane horizontally",
              keys: [ALT, SHIFT, "-"],
              notes: "Create a pane at the right side ",
            },
            {
              name: "Split pane vertically",
              keys: [ALT, SHIFT, "+"],
              notes: "Create a pane below",
            },
            { name: "Close pane", keys: [CTRL, SHIFT, "W"] },
            {
              name: "Move focus to right pane",
              keys: [ALT, "🡺 (right arrow)"],
            },
            { name: "Move focus to left pane", keys: [ALT, "🡸 (left arrow)"] },
            { name: "Move focus to above pane", keys: [ALT, "🡹 (up arrow)"] },
            { name: "Move focus to below pane", keys: [ALT, "🡻 (down arrow)"] },
          ])}
          {shortcutTable("General", [
            { name: "Open settings", keys: [CTRL, ","] },
            { name: "Open keyboard shortcuts", keys: [CTRL, "."] },
          ])}
        </table>
      </div>
    </div>
  );
}
function shortcutTable(
  title: string,
  shortcuts: { name: ReactNode; keys: string[]; notes?: ReactNode }[]
) {
  return (
    <tbody>
      <tr>
        <td colSpan={3}>
          <strong>{title}</strong>
        </td>
      </tr>
      {shortcuts.map((item, i) => (
        <tr key={i}>
          <td>{item.name}</td>
          <td
            className={css`
              width: 240px;
            `}
          >
            {item.keys.map((key) => (
              <strong>
                <code key={key}>{key}</code>
              </strong>
            ))}
          </td>
          <td>{item.notes}</td>
        </tr>
      ))}
    </tbody>
  );
}
