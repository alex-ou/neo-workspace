import { Divider, H2 } from "@blueprintjs/core";
import { css } from "@emotion/css";
import ContentBlockingCard from "./ContentBlockingCard";
import NeverSavedPasswordCard from "./NeverSavedPasswordCard";
import SavedPasswordCard from "./SavedPasswordsCard";
import SearchEngineCard from "./SearchEngineCard";
import { SettingSection } from "./SettingSection";

export default function Settings() {
  return (
    <div
      className={css`
        position: relative;
        height: 100%;
        padding: 16px;
      `}
    >
      <div>
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
          height: calc(100% - 32px);
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
        <SettingSection title="Content blocking">
          <ContentBlockingCard />
        </SettingSection>
        <SettingSection title="Passwords">
          <SavedPasswordCard />
          <NeverSavedPasswordCard />
        </SettingSection>
      </div>
    </div>
  );
}
