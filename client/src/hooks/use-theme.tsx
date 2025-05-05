import * as React from 'react';
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const storedTheme = localStorage.getItem(storageKey);
          return (storedTheme as Theme) || defaultTheme;
        }
        return defaultTheme;
      } catch (e) {
        console.warn("Erro ao acessar localStorage:", e);
        return defaultTheme;
      }
    }
  );

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.document) {
        const root = window.document.documentElement;
        
        root.classList.remove("light", "dark");
        
        if (theme === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
          
          root.classList.add(systemTheme);
          return;
        }
        
        root.classList.add(theme);
      }
    } catch (error) {
      console.error("Erro ao aplicar tema:", error);
    }
  }, [theme]);

  const value = React.useMemo(() => ({
    theme,
    setTheme: (newTheme: Theme) => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(storageKey, newTheme);
        }
      } catch (e) {
        console.warn("Erro ao acessar localStorage:", e);
      }
      setTheme(newTheme);
    },
  }), [theme, storageKey]);

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};
