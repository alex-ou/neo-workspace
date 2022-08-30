import { getSettings, setSettings } from "./app-storage";

interface SettingKeyValueMap {
  passwordNeverSaveDomains: string[];
  searchEngine: string;
  isBlockingAds: boolean;
}

export class Settings {
  dict: SettingKeyValueMap;

  constructor() {
    const dict = getSettings();
    this.dict = dict || { passwordNeverSaveDomains: [] };
  }

  getPasswordNeverSaveDomains = (): string[] => {
    const domains = this.dict["passwordNeverSaveDomains"];
    return domains || [];
  };

  setPasswordNeverSaveDomains = (domains: string[]) => {
    this.dict["passwordNeverSaveDomains"] = domains || [];

    this.save();
  };

  getSearchEngine = (): string => {
    return this.dict["searchEngine"];
  };

  setSearchEngine = (v: string) => {
    this.dict["searchEngine"] = v || "";
    this.save();
  };

  isBlockingAds = () => {
    const v = this.dict["isBlockingAds"];
    return typeof v === "undefined" ? true : v;
  };

  setIsBlockingAds = (v: boolean) => {
    this.dict["isBlockingAds"] = v;
    this.save();
  };

  save = () => {
    setSettings(this.dict);
    window.neonav.application.updateSettings(this.dict);
  };
}

export const settings = new Settings();
