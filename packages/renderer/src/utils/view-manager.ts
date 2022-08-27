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
    const viewId = await neonav.view.createView({
      url: url || "",
      bounds,
    });
    view = {
      containerId,
      container: elem,
      resizeObserver: new ResizeObserver(() => {
        console.log("resizeObserver, view resized", view?.viewId);
        const bounds = getViewBounds(view!.container);
        view!.bounds = bounds;
        neonav.view.setViewBounds({
          id: view!.viewId,
          bounds,
        });
      }),
      bounds,
      viewId,
    };

    view.resizeObserver.observe(view.container);
    this.views.push(view);

    return view;
  };

  destroyView = (containerId: string) => {
    console.log("destroy view:", containerId);
    const index = this.views.findIndex(
      (view) => view.containerId === containerId
    );
    if (index === -1) {
      return;
    }
    const view = this.views[index];
    if (view.viewId) {
      neonav.view.destroyView(view.viewId);
    }
    this.views.splice(index, 1);
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

  focusView = (containerId: string) => {
    console.log("view focus :", containerId);
    const view = this.views.find((view) => view.containerId === containerId);
    if (view && view.viewId) {
      neonav.view.focusView(view.viewId);
    }
  };

  loadViewUrl = (containerId: string, url: string) => {
    const view = this.views.find((view) => view.containerId === containerId);
    console.log("load view url:", containerId, view?.bounds);

    if (view) {
      neonav.view.loadViewUrl({ id: view?.viewId, url });
      neonav.view.setViewBounds({
        id: view?.viewId,
        bounds: view?.bounds,
      });
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
