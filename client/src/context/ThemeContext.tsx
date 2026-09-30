import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeType, ColorScheme, colorSchemes, isColorScheme } from "@/config/themes";

interface ThemeContextType {
  theme: ThemeType;
  colorScheme: ColorScheme;
  toggleTheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
  colors: (typeof colorSchemes)[ColorScheme];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const readStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode); the theme still applies for this session.
  }
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // The design is built dark-first, so dark is the default unless the user picked light.
  const [theme, setTheme] = useState<ThemeType>(() =>
    readStorage("theme") === "light" ? "light" : "dark"
  );

  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const saved = readStorage("colorScheme");
    return isColorScheme(saved) ? saved : "lime";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#08090a" : "#f6f7f4");
    writeStorage("theme", theme);
  }, [theme]);

  useEffect(() => {
    window.document.documentElement.setAttribute("data-theme", colorScheme);
    writeStorage("colorScheme", colorScheme);
  }, [colorScheme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme,
        toggleTheme,
        setColorScheme,
        colors: colorSchemes[colorScheme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
