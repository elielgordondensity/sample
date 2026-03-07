export const colors = {
  background: "#0D1117",
  surface: "#161B22",
  surfaceHover: "#1C2128",
  border: "#30363D",
  borderLight: "#21262D",

  textPrimary: "#E6EDF3",
  textSecondary: "#8B949E",
  textTertiary: "#6E7681",
  textPlaceholder: "#484F58",

  accent: "#58A6FF",
  accentEmphasis: "#388BFD",
  success: "#3FB950",
  successSubtle: "#1A4731",
  danger: "#F85149",
  dangerSubtle: "#4A1E1E",
  warning: "#D29922",
  warningSubtle: "#3D2E00",

  white: "#FFFFFF",
  black: "#010409",
} as const;

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: "400" as const,
    color: colors.textPrimary,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: "400" as const,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 11,
    fontWeight: "400" as const,
    color: colors.textTertiary,
  },
  mono: {
    fontSize: 12,
    fontFamily: "monospace" as const,
    color: colors.textSecondary,
  },
  monoSmall: {
    fontSize: 10,
    fontFamily: "monospace" as const,
    color: colors.textTertiary,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
} as const;
