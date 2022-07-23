import { MosaicNode } from "react-mosaic-component";

export type NodeType = MosaicNode<string> | null;
export const createMosaicNode = () => crypto.randomUUID();

export const getThreeWindowNode = (): NodeType => ({
  direction: "row",
  first: createMosaicNode(),
  second: {
    direction: "column",
    first: createMosaicNode(),
    second: createMosaicNode(),
  },
});

export const getTwoColumnNode = (): NodeType => ({
  direction: "row",
  first: createMosaicNode(),
  second: createMosaicNode(),
});
