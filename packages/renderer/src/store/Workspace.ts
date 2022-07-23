import { NodeType } from "./../utils/mosaic-node";

export interface WorkspaceView {
  containerId: string;
  viewId: string;

  canGoBack?: boolean;
  canGoForward?: boolean;
  title?: string;
  url?: string;
}

export interface Workspace {
  id: string;
  name: string;
  layout?: NodeType;
  isActive: boolean;
  views: WorkspaceView[];
}
