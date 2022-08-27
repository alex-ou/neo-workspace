import { Workspace } from "../store/workspace";
import { WorkspaceView } from "./../store/workspace";
import { NeoComponentType, NEO_ADDRESS_PREFIX } from "./../utils/address-input";
import {
  findNextInDirection,
  findPrevInDirection,
  NodeType,
} from "./../utils/mosaic-node";
import { defaultViewManager } from "./../utils/view-manager";

import { useEffect } from "react";
import {
  BrowserViewCommand,
  OpenUrlCommand,
  SwitchWorkspaceCommand,
  ViewCommandType,
} from "./../types";

import { AppAction } from "../store";
import { getPath, getTopLeftNode } from "../utils/mosaic-node";

type CommandFuncMap = {
  [key in Exclude<ViewCommandType, "openUrl" | "switchWorkspace">]?: (
    command: BrowserViewCommand
  ) => void;
} & {
  openUrl?: (command: OpenUrlCommand) => void;
  switchWorkspace?: (command: SwitchWorkspaceCommand) => void;
};

export function useViewCommands(map: CommandFuncMap, deps?: any[]) {
  useEffect(() => {
    const commandTypes = Object.keys(map);

    const listener = (e: CustomEvent<BrowserViewCommand>) => {
      const data = e.detail;
      if (commandTypes.includes(data.type)) {
        map[data.type]?.(data as any);
      }
    };
    document.addEventListener("viewcommand", listener);
    return () => {
      document.removeEventListener("viewcommand", listener);
    };
  }, [map, deps]);
}

export function useWorkspaceCommandHandling(
  workspaces: Workspace[],
  dispatch: (value: AppAction) => void
) {
  const workspace = workspaces.find((w) => w.isActive);

  const setFocusingView = (node: NodeType, views?: WorkspaceView[]) => {
    if (!node) {
      return;
    }
    const view = (views || []).find((v) => v.containerId === node);
    if (view?.url) {
      defaultViewManager.focusView(node as string);
    } else {
      window.neonav.window.focus();
    }

    dispatch({
      type: "update-workspace-view",
      payload: {
        containerId: node as string,
        isFocused: true,
      },
    });
  };

  const moveToTopLeftNode = (workspace?: Workspace) => {
    const tree: NodeType = workspace?.layout || null;
    const focusedView = (workspace?.views || []).find((v) => v.isFocused);
    const topLeftNode = getTopLeftNode(tree);
    if (!focusedView && topLeftNode) {
      dispatch({
        type: "update-workspace-view",
        payload: {
          containerId: topLeftNode as string,
          isFocused: true,
        },
      });
      return true;
    }
    return false;
  };

  const getFocusedNodePath = (workspace?: Workspace) => {
    const tree: NodeType = workspace?.layout || null;
    const focusedView = (workspace?.views || []).find((v) => v.isFocused);

    return getPath(tree, focusedView?.containerId);
  };

  const openNeoUrl = (comp: NeoComponentType, name: string) => {
    const neoUrl = `${NEO_ADDRESS_PREFIX}${comp}`;
    const w = workspaces.find((w) => w.views.find((v) => v.url === neoUrl));
    if (w) {
      dispatch({
        type: "switch-workspace",
        payload: {
          workspaceId: w.id,
        },
      });
    } else {
      dispatch({
        type: "add-workspace",
        payload: {
          isActive: true,
          name: name,
          url: neoUrl,
        },
      });
    }
  };

  useViewCommands(
    {
      openSettings: () => {
        openNeoUrl("settings", "Settings");
      },
      openKeyboardShortcuts: () => {
        openNeoUrl("keyboard-shortcuts", "keyboard shortcuts");
      },
      openUrl: ({ commandData }) => {
        if (!commandData.viewId) {
          dispatch({
            type: "add-workspace",
            payload: {
              isActive: !commandData.inBackground,
              name: commandData.urlText,
              url: commandData.url,
            },
          });
        }
      },
      reopenLastClosedWorkspace: () => {
        dispatch({
          type: "open-last-closed-workspace",
        });
      },
      moveWindowFocusDown: () => {
        if (moveToTopLeftNode(workspace)) {
          return;
        }
        const tree: NodeType = workspace?.layout || null;
        setFocusingView(
          findNextInDirection(tree, getFocusedNodePath(workspace), "column"),
          workspace?.views
        );
      },
      moveWindowFocusUp: () => {
        if (moveToTopLeftNode(workspace)) {
          return;
        }
        const tree: NodeType = workspace?.layout || null;
        setFocusingView(
          findPrevInDirection(tree, getFocusedNodePath(workspace), "column"),
          workspace?.views
        );
      },
      moveWindowFocusRight: () => {
        if (moveToTopLeftNode(workspace)) {
          return;
        }
        const tree: NodeType = workspace?.layout || null;
        setFocusingView(
          findNextInDirection(tree, getFocusedNodePath(workspace), "row"),
          workspace?.views
        );
      },
      moveWindowFocusLeft: () => {
        if (moveToTopLeftNode(workspace)) {
          return;
        }
        const tree: NodeType = workspace?.layout || null;
        setFocusingView(
          findPrevInDirection(tree, getFocusedNodePath(workspace), "row"),
          workspace?.views
        );
      },
    },
    [workspace, dispatch]
  );
}
