import dropRight from "lodash/dropRight";
import last from "lodash/last";
import {
  Corner,
  getNodeAtPath,
  getPathToCorner,
  isParent,
  MosaicDirection,
  MosaicNode,
  MosaicPath,
} from "react-mosaic-component";

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

export const getTopLeftNode = (tree: NodeType): NodeType => {
  const path = getPathToCorner(tree, Corner.TOP_LEFT);
  return getNodeAtPath<string>(tree, path);
};

export function getPath(
  tree: NodeType,
  node: string | undefined
): MosaicPath | null {
  const findNodePath = (
    tree: NodeType,
    node: string | undefined,
    path: MosaicPath
  ): MosaicPath | null => {
    if (tree === node) {
      return path;
    }
    if (!tree || !node || !isParent(tree)) {
      return null;
    }

    let childPath;
    if ((childPath = findNodePath(tree.first, node, path.concat("first")))) {
      return childPath;
    }
    if ((childPath = findNodePath(tree.second, node, path.concat("second")))) {
      return childPath;
    }
    return null;
  };

  return findNodePath(tree, node, []);
}

export function getParentPath(path: MosaicPath): MosaicPath | null {
  return path.length > 0 ? dropRight(path) : null;
}

export function findLeftMostNode(tree: NodeType): NodeType | null {
  if (!tree) return null;
  if (isParent(tree)) {
    return findLeftMostNode(tree.first);
  }
  return tree;
}

export function findRightMostNode(tree: NodeType | null): NodeType | null {
  if (!tree) return null;
  if (isParent(tree)) {
    if (tree.direction === "row") {
      return findRightMostNode(tree.second);
    }
    return findRightMostNode(tree.first);
  }
  return tree;
}

export const findNextInDirection = (
  tree: NodeType | null,
  nodePath: MosaicPath | null,
  direction: MosaicDirection
): NodeType => {
  if (!nodePath) return null;

  const parentPath = getParentPath(nodePath);
  if (!parentPath) {
    return null;
  }

  const parentNode = getNodeAtPath(tree, parentPath);
  if (!parentNode || !isParent(parentNode)) {
    return null;
  }

  if (
    parentNode.direction === direction &&
    parentNode.second &&
    last(nodePath) !== "second"
  ) {
    return findLeftMostNode(parentNode.second);
  }

  return findNextInDirection(tree, parentPath, direction);
};

export const findPrevInDirection = (
  tree: NodeType | null,
  nodePath: MosaicPath | null,
  direction: MosaicDirection
): NodeType => {
  if (!nodePath) return null;
  const parentPath = getParentPath(nodePath);
  if (!parentPath) {
    return null;
  }

  const parentNode = getNodeAtPath(tree, parentPath);
  if (!parentNode || !isParent(parentNode)) {
    return null;
  }

  if (
    parentNode.direction === direction &&
    parentNode.first &&
    last(nodePath) !== "first"
  ) {
    return findRightMostNode(parentNode.first);
  }

  return findPrevInDirection(tree, parentPath, direction);
};
