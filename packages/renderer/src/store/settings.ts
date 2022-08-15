import { getSettings, setSettings } from "./app-storage";

interface SettingKeyValueMap {
  passwordNeverSaveDomains: string[];
  searchEngine: string;
}

export class Setttings {
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

  save = () => setSettings(this.dict);
}

export const settings = new Setttings();
