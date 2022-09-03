import { Icon } from "@blueprintjs/core";

export default function Favicon(props: { url?: string }) {
  let origin;
  try {
    origin = props.url ? new URL(props.url).origin : "";
  } catch {}
  return origin ? (
    <img
      style={{ borderRadius: "50%" }}
      height={16}
      width={16}
      src={`${origin}/favicon.ico`}
    ></img>
  ) : (
    <Icon icon="globe-network" />
  );
}
