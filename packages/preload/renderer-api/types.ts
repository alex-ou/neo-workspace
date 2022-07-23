export interface ViewBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ViewInfo {
  canGoBack: boolean;
  canGoForward: boolean;
  viewId: string;
  title: string;
  url: string;
}

export interface UnityView {
  hideAllViews(): Promise<void>;
  showAllViews(): Promise<void>;

  goBack(viewId: string): Promise<void>;
  goForward(viewId: string): Promise<void>;

  destroyView(viewId: string): Promise<void>;

  createView(options: { url: string; bounds: ViewBounds }): Promise<string>;

  setViewBounds(options: { id: string; bounds: ViewBounds }): Promise<void>;

  loadViewUrl(options: { id: string; url: string }): Promise<void>;

  onNavigate(callback: (data: ViewInfo) => void): Promise<void>;
}

export interface WindowState {
  minimized: boolean;
  maximized: boolean;
}
export interface UnityWindow {
  maximize(): Promise<void>;
  unmaximize(): Promise<void>;
  minimize(): Promise<void>;
  close(): Promise<void>;
  getState(): Promise<WindowState>;
}

export interface Unity1API {
  view: UnityView;
  window: UnityWindow;
}
