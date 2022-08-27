import { Divider, H2 } from "@blueprintjs/core";
import { css } from "@emotion/css";
import NeverSavedPasswordCard from "./NeverSavedPasswordCard";
import SavedPasswordCard from "./SavedPasswordsCard";
import SearchEngineCard from "./SearchEngineCard";
import { SettingSection } from "./SettingSection";

export default function Settings() {
  return (
    <div
      id="neo-settings"
      className={css`
        position: relative;
        height: 100%;
        padding: 16px;
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
  );
}
