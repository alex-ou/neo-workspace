import { Notification, shell } from "electron";
import electronDl from "electron-dl";
import { logoIcon } from "./utils";

electronDl({
  onStarted: (item) => {
    const notification = new Notification({
      icon: logoIcon,
      title: "Download Started",
      body: item.getFilename(),
    });
    notification.show();
  },
  onCompleted: (file) => {
    const notification = new Notification({
      icon: logoIcon,
      title: "Download Complete",
      body: file.path,
    });
    notification.on("click", () => {
      shell.showItemInFolder(file.path);
    });
    notification.show();
  },
});

export {};
