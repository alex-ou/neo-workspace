import { app, session } from "electron";
import fs from "fs";
import { join } from "path";

import { ElectronRequestType, FiltersEngine, Request } from "@cliqz/adblocker";
import { getSetting } from "./settings";

const easylistPath = join(__dirname, "./data/easylist.txt");

let filterEngine: FiltersEngine;

fs.readFile(easylistPath, "utf8", (error, data) => {
  if (error) {
    console.log(error);
    return;
  }
  filterEngine = FiltersEngine.parse(data);
});

function registerFiltering(ses: Electron.Session) {
  ses.webRequest.onBeforeRequest((details, callback) => {
    if (!filterEngine || !getSetting().isBlockingAds) {
      callback({});
      return;
    }

    const { id, url, resourceType, referrer } = details;

    const request = Request.fromRawDetails({
      requestId: `${id}`,
      sourceUrl: referrer,
      type: (resourceType || "other") as ElectronRequestType,
      url,
    });
    if (request.type === "other") {
      request.guessTypeOfRequest();
    }

    if (request.isMainFrame()) {
      callback({});
      return;
    }

    const { redirect, match } = filterEngine.match(request);

    if (redirect) {
      callback({ redirectURL: redirect.dataUrl });
    } else if (match) {
      callback({ cancel: true });
    } else {
      callback({});
    }
  });
}

app.once("ready", function () {
  registerFiltering(session.defaultSession);
});

app.on("session-created", registerFiltering);
