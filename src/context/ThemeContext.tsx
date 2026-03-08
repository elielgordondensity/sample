import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useColorScheme } from "react-native";
import {
  type Colors,
  darkColors,
  lightColors,
  getTypography,
} from "../components/tokens";
import { getString, setString, STORAGE_KEYS } from "../utils/storage";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "../utils/storage";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  colors: Colors;
  typography: ReturnType<typeof getTypography>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [storedMode, setStoredMode] = useMMKVString(STORAGE_KEYS.THEME, storage);
  const mode: ThemeMode = (storedMode as ThemeMode) || "dark";

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      setStoredMode(newMode);
    },
    [setStoredMode],
  );

  const isDark =
    mode === "dark" || (mode === "system" && systemScheme !== "light");

  const colors = isDark ? darkColors : lightColors;
  const typo = useMemo(() => getTypography(colors), [colors]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, setMode, isDark, colors, typography: typo }),
    [mode, setMode, isDark, colors, typo],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
