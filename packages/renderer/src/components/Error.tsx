import { Icon, H4 } from "@blueprintjs/core";
import { css } from "@emotion/css";

export default function Error(props: { error: string }) {
  return (
    <div
      className={css`
        margin-top: 16px;
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      `}
    >
      <Icon icon="error" size={32} />
      <H4>Oops..!</H4>
      <b>Something went wrong: {props.error}. Please try again.</b>
    </div>
  );
}
