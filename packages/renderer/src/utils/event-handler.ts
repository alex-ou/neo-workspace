import { handleAutoFillRequest, handleFormFilled } from "../password-manager";
import { BrowserViewCommand, ReaderModeReadyDetail } from "./../types";

export function registerEventHandlers() {
  const { passwordService, application, readerModeService } = window.neonav;

  passwordService.onAutoFill(handleAutoFillRequest);
  passwordService.onFormFilled(handleFormFilled);
  readerModeService.onReaderModeReady((viewId) => {
    document.dispatchEvent(
      new CustomEvent<ReaderModeReadyDetail>("readermodeready", {
        detail: {
          viewId,
        },
      })
    );
  });

  application.onBrowserViewCommand((e, command) => {
    console.log("onBrowserViewCommand", e, command);
    document.dispatchEvent(
      new CustomEvent<BrowserViewCommand>("viewcommand", {
        detail: command,
      })
    );
  });
}
