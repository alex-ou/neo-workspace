import { Button, Colors } from "@blueprintjs/core";
import { ReactComponent as BookOpenIcon } from "../assets/book-open.svg";

export default function ReaderModeButton(props: {
  isReaderModeReady: boolean;
  isInReaderMode: boolean;
  onReadModeChange: (isInReaderMode: boolean) => void;
}) {
  const { isInReaderMode } = props;

  return props.isReaderModeReady ? (
    <Button
      intent={isInReaderMode ? "primary" : "none"}
      style={{
        paddingTop: 2,
        color: isInReaderMode ? Colors.BLUE4 : "inherit",
      }}
      title="Show reader view"
      minimal
      onClick={() => {
        if (isInReaderMode) {
          props.onReadModeChange(false);
        } else {
          props.onReadModeChange(true);
        }
      }}
    >
      <BookOpenIcon />
    </Button>
  ) : null;
}
