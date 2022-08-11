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

export interface NeoView {
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
export interface NeoWindow {
  maximize(): Promise<void>;
  unmaximize(): Promise<void>;
  minimize(): Promise<void>;
  close(): Promise<void>;
  getState(): Promise<WindowState>;
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
}
