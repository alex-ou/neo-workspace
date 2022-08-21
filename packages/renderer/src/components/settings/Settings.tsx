import { Button, Divider, H2 } from "@blueprintjs/core";
import { css } from "@emotion/css";
import { useState } from "react";
import { useViewCommand } from "../../utils/event-handler";
import NeverSavedPasswordCard from "./NeverSavedPasswordCard";
import SavedPasswordCard from "./SavedPasswordsCard";
import SearchEngineCard from "./SearchEngineCard";
import { SettingSection } from "./SettingSection";

export default function Settings() {
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);

  useViewCommand("openSettings", () => {
    setSettingsVisible(true);
    window.neonav.view.hideAllViews();
  });

  return (
    <div>
      {settingsVisible && (
        <div
          id="neo-settings"
          className={[
            css`
              padding: 8px 32px;
              position: fixed;
              top: 34px;
              left: 4px;
              right: 4px;
              bottom: 4px;
              z-index: 13;
            `,
          ].join(" ")}
        >
          <div
            className={css`
              position: relative;
              height: 100%;
            `}
          >
            <div
              className={css`
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 48px;
              `}
            >
              <H2>Settings</H2>
              <Button
                minimal
                icon="cross"
                onClick={() => {
                  setSettingsVisible(false);
                  window.neonav.view.showAllViews();
                }}
              />
            </div>
            <Divider
              className={css`
                margin-top: 0;
                margin-bottom: 16px;
              `}
            />
            <div
              className={css`
                height: calc(100% - 64px);
                overflow-x: auto;
                overflow-y: auto;
                width: 100%;
                box-sizing: border-box;
                padding: 2px;
              `}
            >
              <SettingSection title="Search engine">
                <SearchEngineCard />
              </SettingSection>
              <SettingSection title="Passwords">
                <SavedPasswordCard />
                <NeverSavedPasswordCard />
              </SettingSection>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
