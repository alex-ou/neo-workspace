import { css } from "@emotion/css";
import { ReactNode } from "react";

export function SettingSection(props: { title: string; children: ReactNode }) {
  return (
    <div
      className={css`
        margin-bottom: 32px;
      `}
    >
      <h3 className="bp4-heading">{props.title}</h3>
      {props.children}
    </div>
  );
}
