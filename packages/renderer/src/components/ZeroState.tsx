import { Button, NonIdealState } from "@blueprintjs/core";
import { useContext } from "react";
import { MosaicContext } from "react-mosaic-component";
import { CreateNode, MosaicKey } from "react-mosaic-component/lib/types";
export interface ZeroStateProps<T extends MosaicKey> {
  createNode?: CreateNode<T>;
}
function ZeroState<T extends MosaicKey>(props: ZeroStateProps<T>) {
  const { mosaicActions } = useContext(MosaicContext);
  return (
    <NonIdealState
      className="mosaic-zero-state"
      icon="applications"
      title="Your workspace is empty"
      action={
        <Button
          icon="add"
          onClick={async () => {
            const node = await props.createNode!();
            mosaicActions.replaceWith([], node);
          }}
        >
          Add new window
        </Button>
      }
    ></NonIdealState>
  );
}

export default ZeroState;
