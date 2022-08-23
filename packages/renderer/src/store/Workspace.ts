import { NodeType } from "../utils/mosaic-node";

export interface WorkspaceView {
  containerId: string;
  viewId?: string;

  canGoBack?: boolean;
  canGoForward?: boolean;
  title?: string;
  url?: string;
  isLoading?: boolean;
  isFocused?: boolean;
  error?: string;
}

export interface Workspace {
  id: string;
  name: string;
  layout?: NodeType;
  isActive: boolean;
  views: WorkspaceView[];
}
