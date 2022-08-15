//@ts-ignore
import urlParser from "../utils/url-parser";
import { settings } from "../store/settings";

export interface SearchEngineItem {
  name: string;
  searchURL: string;
  queryParam: string;
  label: string;
  suggestionsURL?: string;
}

export const searchEngines: { [key: string]: SearchEngineItem } = {
  Google: {
    name: "Google",
    searchURL: "https://www.google.com/search?q=%s",
    queryParam: "q",
    label: "Google",
  },
  Baidu: {
    name: "Baidu",
    searchURL: "https://www.baidu.com/s?wd=%s",
    suggestionsURL: "https://www.baidu.com/su?wd=%s&action=opensearch",
    queryParam: "wd",
    label: "百度",
  },

  Bing: {
    name: "Bing",
    searchURL: "https://www.bing.com/search?q=%s",
    suggestionsURL: "https://www.bing.com/osjson.aspx?query=%s",
    queryParam: "q",
    label: "Bing",
  },
  DuckDuckGo: {
    name: "DuckDuckGo",
    searchURL: "https://duckduckgo.com/?q=%s&t=min",
    suggestionsURL: "https://ac.duckduckgo.com/ac/?q=%s&type=list&t=min",
    queryParam: "q",
    label: "DuckDuckGo",
  },
  Yahoo: {
    name: "Yahoo",
    searchURL: "https://search.yahoo.com/yhs/search?p=%s",
    suggestionsURL: "https://search.yahoo.com/sugg/os?command=%s&output=fxjson",
    queryParam: "p",
    label: "Yahoo!7",
  },
};

export function getDefaultSearchEngine() {
  let lang = navigator.language;
  if (navigator.languages) lang = navigator.languages[0];
  if (lang === "zh" || lang === "zh-CN") {
    return searchEngines.Baidu;
  }
  return searchEngines.Google;
}

export function getCurrentSearchEngine() {
  const name = settings.getSearchEngine();

  //@ts-ignore
  return searchEngines[name] || getDefaultSearchEngine();
}

export function parseAddressBarInput(value: string) {
  let url = urlParser.parse(value);
  if (url) {
    return url;
  }
  return getCurrentSearchEngine().searchURL.replace(
    "%s",
    encodeURIComponent(value)
  );
}
