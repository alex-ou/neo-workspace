export interface ViewBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ViewInfo {
  canGoBack?: boolean;
  canGoForward?: boolean;
  viewId?: string;
  title?: string;
  url?: string;
  isLoading?: boolean;
  error?: string;
}

export interface NeoView {
  hideAllViews(): Promise<void>;
  showAllViews(): Promise<void>;

  goBack(viewId: string): Promise<void>;
  goForward(viewId: string): Promise<void>;

  destroyView(viewId: string): Promise<void>;

  hideView(viewId: string): Promise<void>;
  showView(viewId: string): Promise<void>;

  focusView(viewId: string): Promise<void>;

  createView(options: { url: string; bounds: ViewBounds }): Promise<string>;

  setViewBounds(options: { id: string; bounds: ViewBounds }): Promise<void>;

  loadViewUrl(options: { id: string; url: string }): Promise<void>;

  onUpdate(callback: (data: ViewInfo) => void): Promise<void>;
}

export interface WindowState {
  isMinimized: boolean;
  isFullscreen: boolean;
  isMaximized: boolean;
}
export interface NeoWindow {
  focus(): Promise<void>;
  maximize(): Promise<void>;
  unmaximize(): Promise<void>;
  minimize(): Promise<void>;
  close(): Promise<void>;
  getState(): Promise<WindowState>;
  setTheme(options: { theme: "light" | "dark" }): Promise<void>;
}
export interface DomainCredential {
  username: string;
  password: string;
  domain: string;
}

export interface MatchingCredentials {
  domain: string;
  credentials: { username: string; password: string }[];
}

export interface PasswordService {
  onAutoFill: (fn: IpcMessageListener) => void;
  autofillMatched: (options: {
    id: string;
    frameId: string;
    frameUrl: string;
    data: MatchingCredentials;
  }) => void;
  onFormFilled: (fn: IpcMessageListener) => void;
  getCredentials: () => Promise<DomainCredential[]>;
  deleteCredential: (options: {
    domain: string;
    username: string;
  }) => Promise<void>;
  saveCredential: (d: DomainCredential) => Promise<void>;
}

export interface Application {
  updateSettings: (settings: { [key: string]: any }) => Promise<void>;
  showAppMenu: () => Promise<void>;
  onBrowserViewCommand: (callback: (e: any, command: any) => void) => void;
}
export type IpcMessageListener = (
  viewId: string,
  data: any,
  frameId: string,
  frameUrl: string
) => void;

export interface NeoNavAPI {
  view: NeoView;
  window: NeoWindow;
  passwordService: PasswordService;
  application: Application;
}
