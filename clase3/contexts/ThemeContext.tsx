import { createContext, useContext, useMemo, useState } from "react";

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

type ContextType = {
  theme: Theme;
  toggleTheme: () => void;
}

const initialValue = {
  theme: Theme.LIGHT,
  toggleTheme: () => {},
}

// Primera parte: declaracion del contexto
const ThemeContext = createContext<ContextType>(initialValue);

// Segunda parte: proveedor del contexto
export const ThemeProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

  function toggleTheme() {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  }

  const value = useMemo(() => {
    return { 
      theme, 
      toggleTheme 
    };
  }, [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Tercera parte: funcion para consumer
export const useTheme = (): ContextType => useContext(ThemeContext);