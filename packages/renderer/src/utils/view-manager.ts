import { getViewBounds } from "./dom-util";

const { unity1 } = window;

interface ViewInfo {
  containerId: string;
  container: HTMLElement;
  resizeObserver: ResizeObserver;
  viewId: string;
}

export class ViewManager {
  views: ViewInfo[] = [];

  init = () => {};

  createView = async (
    containerId: string,
    elem: HTMLElement,
    url?: string
  ): Promise<ViewInfo> => {
    let view = this.views.find((view) => view.containerId === containerId);
    if (view) {
      console.log("found view", containerId, view.viewId);
      view.resizeObserver.unobserve(view.container);
      view.container = elem;
      view.resizeObserver.observe(elem);
      return view;
    }
    console.log("creating new view", containerId);
    view = {
      containerId,
      container: elem,
      resizeObserver: new ResizeObserver(() => {
        console.log("resized", view?.viewId);
        window.unity1.view.setViewBounds({
          id: view!.viewId,
          bounds: getViewBounds(view!.container),
        });
      }),
      viewId: await unity1.view.createView({
        url: url || "",
        bounds: getViewBounds(elem),
      }),
    };
    this.views.push(view);

    view.resizeObserver.observe(view.container);
    return view;
  };

  destroyView = (containerId: string) => {
    console.log("destroy view:", containerId);
    const view = this.views.find((view) => view.containerId === containerId);
    if (view && view.viewId) {
      unity1.view.destroyView(view.viewId);
      view.viewId = "";
    }
  };

  goForward = (containerId: string) => {
    console.log("view go forward :", containerId);
    const view = this.views.find((view) => view.containerId === containerId);
    if (view && view.viewId) {
      unity1.view.goForward(view.viewId);
    }
  };

  goBack = (containerId: string) => {
    console.log("view go backward :", containerId);
    const view = this.views.find((view) => view.containerId === containerId);
    if (view && view.viewId) {
      unity1.view.goBack(view.viewId);
    }
  };

  loadViewUrl = (containerId: string, url: string) => {
    console.log("load view url:", containerId);
    const view = this.views.find((view) => view.containerId === containerId);
    if (view) unity1.view.loadViewUrl({ id: view?.viewId, url });
  };

  hideAllViews() {
    unity1.view.hideAllViews();
  }
  showAllViews() {
    unity1.view.showAllViews();
  }
}

export const defaultViewManager = new ViewManager();
