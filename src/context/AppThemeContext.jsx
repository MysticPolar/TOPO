import { createContext, useContext } from "react";

/** @typedef {"light" | "dark"} AppTheme */

export const AppThemeContext = createContext(
  /** @type {{ theme: AppTheme }} */ ({ theme: "light" }),
);

export function useAppTheme() {
  return useContext(AppThemeContext);
}
