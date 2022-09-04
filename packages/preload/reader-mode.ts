import * as readerModeService from "./renderer-api/reader-mode-service";
import { Readability, isProbablyReaderable } from "@mozilla/readability";
export function initializeReaderMode() {
  if (isProbablyReaderable(document)) {
    readerModeService.notifyReaderModeReady();
  }

  function removeElements(type: string) {
    var st = document.getElementsByTagName(type);
    for (let i = 0; i < st.length; i++) {
      st[i].parentNode?.removeChild(st[i]);
    }
  }

  readerModeService.onShowReaderView(
    (data: { style: string; theme: string }) => {
      console.log("onShowReaderView ", data);

      var documentClone = document.cloneNode(true);
      const result = new Readability(documentClone as Document).parse();
      document.body.className = `bp4-${data.theme}`;
      document.documentElement.className = `bp4-${data.theme}`;

      removeElements("style");
      for (let i = 0; i < document.styleSheets.length; i++) {
        document.styleSheets[i].disabled = true;
      }

      document.body.innerHTML = `<div class='neo-content-container bp4-running-text'>
        <h1 class="bp4-heading">${result?.title || ""}</h1>
        ${result?.content || ""}
      </div>`;

      const style = document.createElement("style");
      style.textContent = data.style;
      document.head.append(style);
    }
  );
}
