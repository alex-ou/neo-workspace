import path from "path";
import electronDl from "electron-dl";
import { Notification, shell, app, nativeImage } from "electron";

const icon = nativeImage.createFromPath(path.join(__dirname, "./logo.png"));

electronDl({
  onStarted: (item) => {
    const notification = new Notification({
      icon,
      title: "Download Started",
      body: item.getFilename(),
    });
    notification.show();
  },
  onCompleted: (file) => {
    const notification = new Notification({
      icon,
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
