import { Card, Switch } from "@blueprintjs/core";
import { css } from "@emotion/css";
import React, { useState } from "react";
import { settings } from "../../store/settings";

export default function ContentBlockingCard() {
  const [isChecked, setIsChecked] = useState(settings.isBlockingAds());
  return (
    <Card>
      <div
        className={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        Block ads and trackers
        <Switch
          large
          checked={isChecked}
          onChange={(event) => {
            const v = (event.target as HTMLInputElement).checked;
            settings.setIsBlockingAds(v);
            setIsChecked(v);
          }}
        ></Switch>
      </div>
    </Card>
  );
}
