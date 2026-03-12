import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";

import { ColorTheme, COLORS_LIGHT, COLORS_DARK } from "./colors";
import { borderRadius, BorderRadius } from "./border-radius";
import { spacing, Spacing } from "./spacing";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeMode;
  mode: ThemeMode;
  colors: ColorTheme;
  spacing: Spacing;
  borderRadius: BorderRadius;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  mode: "system",
  colors: COLORS_LIGHT,
  spacing,
  borderRadius,
  isDark: false,
  setTheme: () => {},
  setMode: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "system",
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeMode>(defaultTheme);

  // Determine if dark mode is active
  const isDark =
    theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');
  // const isDark = false;
  // Get the appropriate color palette
  const currentColors = isDark ? COLORS_DARK : COLORS_LIGHT;

  // Effect to handle system theme changes
  useEffect(() => {
    if (theme === "system") {
      // Force update when system theme changes
    }
  }, [systemColorScheme, theme]);

  const value = {
    theme,
    mode: theme,
    colors: currentColors,
    spacing,
    borderRadius,
    isDark,
    setTheme,
    setMode: setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeProvider;
