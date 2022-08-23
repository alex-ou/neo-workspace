import { getViewBounds, ViewBounds } from "./dom-util";

const { neonav } = window;

interface ViewInfo {
  containerId: string;
  container: HTMLElement;
  resizeObserver: ResizeObserver;
  viewId: string;
  bounds: ViewBounds;
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
    if (view && view.viewId) {
      console.log("found view", containerId, view.viewId);
      view.resizeObserver.unobserve(view.container);
      view.container = elem;
      view.resizeObserver.observe(elem);
      return view;
    }
    console.log("creating new view for", containerId);
    const bounds = getViewBounds(elem);
    view = {
      containerId,
      container: elem,
      resizeObserver: new ResizeObserver(() => {
        console.log("resized", view?.viewId);
        const bounds = getViewBounds(view!.container);
        view!.bounds = bounds;
        window.neonav.view.setViewBounds({
          id: view!.viewId,
          bounds,
        });
      }),
      bounds,
      viewId: await neonav.view.createView({
        url: url || "",
        bounds,
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
      neonav.view.destroyView(view.viewId);
      view.viewId = "";
    }
  };

  goForward = (containerId: string) => {
    console.log("view go forward :", containerId);
    const view = this.views.find((view) => view.containerId === containerId);
    if (view && view.viewId) {
      neonav.view.goForward(view.viewId);
    }
  };

  goBack = (containerId: string) => {
    console.log("view go backward :", containerId);
    const view = this.views.find((view) => view.containerId === containerId);
    if (view && view.viewId) {
      neonav.view.goBack(view.viewId);
    }
  };

  loadViewUrl = (containerId: string, url: string) => {
    const view = this.views.find((view) => view.containerId === containerId);
    console.log("load view url:", containerId, view?.bounds);

    if (view) {
      neonav.view.loadViewUrl({ id: view?.viewId, url });
    }
  };

  hideAllViews() {
    neonav.view.hideAllViews();
  }
  showAllViews() {
    neonav.view.showAllViews();
  }
}

export const defaultViewManager = new ViewManager();
