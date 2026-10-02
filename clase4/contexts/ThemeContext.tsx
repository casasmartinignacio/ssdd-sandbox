"use client";

import { createContext, useContext, useState } from "react";

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

type ContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ContextType>({
  theme: Theme.LIGHT,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(Theme.LIGHT);

  function toggleTheme() {
    setTheme((current) => (current === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
