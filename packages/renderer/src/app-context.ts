import { Workspace } from "./store/Workspace";
import React from "react";

export interface AppContextType {
  darkTheme?: boolean;
  toggleTheme?: () => void;
}

export const AppContext = React.createContext<AppContextType>({
  darkTheme: false,
  toggleTheme: () => {},
});

export function useAppContext() {
  return React.useContext<AppContextType>(AppContext);
}
