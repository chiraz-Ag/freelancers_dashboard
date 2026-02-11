// src/contexts/ThemeContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

const themeOptions = {
  rosewood: {
    primary: { main: "#e8b7c8", light: "#f4d1dc", dark: "#c296a7" },
    secondary: { main: "#ba68c8", light: "#e1bee7", dark: "#9c27b0" },
  },
  dark: {
    primary: { main: "#546e7a", light: "#78909c", dark: "#37474f" },
    secondary: { main: "#ff5722", light: "#ff7043", dark: "#e64a19" },
  },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // 1. Initialisation à partir du localStorage
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isDark");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // 2. Persist la préférence
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isDark", JSON.stringify(isDark));
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const selected = isDark ? "dark" : "rosewood";
  const palette = themeOptions[selected];

  const theme = createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: palette.primary,
      secondary: palette.secondary,
      background: {
        default: isDark ? "#121212" : "#f5f5f5",
        paper: isDark ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: isDark ? "#fff" : "#000",
        secondary: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
      },
    },
    typography: {
      fontFamily: '"Roboto", sans-serif',
      h1: { fontWeight: 500 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, textTransform: "none", fontWeight: 600 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? "#272727"
              : themeOptions.rosewood.primary.main,
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
