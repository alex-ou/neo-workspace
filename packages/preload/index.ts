import { exposeNeoNavAPI } from "./renderer-api";
import initializePasswordFill from "./password-fill";
import { initializeReaderMode } from "./reader-mode";

exposeNeoNavAPI();

function domReady(
  condition: DocumentReadyState[] = ["complete", "interactive"]
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const isWebView = process.argv.includes("--web-view");

domReady().then(() => {
  if (isWebView) {
    initializePasswordFill();
    initializeReaderMode();
  }
});
