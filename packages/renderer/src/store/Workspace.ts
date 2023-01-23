import { NodeType } from "../utils/mosaic-node";

export interface WorkspaceView {
  containerId: string;
  viewId?: string;

  isInReaderMode?: boolean;
  isReaderModeReady?: boolean;

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
  isAddressBarHidden?: boolean;
  views: WorkspaceView[];
}
