// import {useColorScheme} from 'react-native';

export const colors = {
  amber: {
    0: "#fff5e6",
    1: "#f6dab9",
    2: "#ECBE87",
    3: "#D1915D",
    4: "#A6653E",
  },
  midnight: {
    1: "#304354",
    2: "#1D2C38",
  },
  gray: {
    "000": "#F4F5F6", // Lightest
    "100": "#EEF0F1",
    "200": "#E0E3E6",
    "300": "#C1C6CD",
    "400": "#929BA5",
    "500": "#67727E",
    "600": "#4E5865",
    "700": "#39424C",
    "800": "#31383F",
    "900": "#272D34",
    carbono: "#121921",
  },
  blue: {
    "000": "#F6F9FE",
    "050": "#E6F1FF",
    "100": "#B4D5FE",
    "200": "#76B3FE",
    "300": "#3A92FD",
    "400": "#0876FD",
    "500": "#0964D3",
    "600": "#0B51A8",
    "700": "#0E3D77",
    "800": "#102C4C",
  },
  orange: {
    "000": "#FEFAF6",
    "050": "#FFF4E6",
    "100": "#FEDCB4",
    "200": "#FEC176",
    "300": "#FDA53A",
    "400": "#FD8E08",
    "500": "#CF770C",
    "600": "#A26011",
    "700": "#6E4717",
    "800": "#402F1C",
  },
  green: {
    "000": "#F6FEF9",
    "050": "#E6FFF4",
    "100": "#B4FEDC",
    "200": "#76FEC1",
    "300": "#3AFDA5",
    "400": "#08FD8E",
    "500": "#0CCF77",
    "600": "#11A260",
    "700": "#176E47",
    "800": "#1C402F",
  },
  red: {
    "000": "#FEF6F6",
    "050": "#FFE6E6",
    "100": "#FFB4B4",
    "200": "#FF7676",
    "300": "#FF3A3A",
    "400": "#FF0808",
    "500": "#D30909",
    "600": "#A80B0B",
    "700": "#770E0E",
    "800": "#4C1010",
  },
  sage: {
    1: "#E0E9E4",
    2: "#CBDCD3",
    3: "#A7BDB1",
    4: "#677B70",
  },
  ocean: {
    1: "#D8E0EE",
    2: "#B9C8E1",
    3: "#919FC2",
    4: "#647295",
  },
  linen: {
    1: "#F7F1E8",
    2: "#EAE2D5",
    3: "#DFD2C1",
    4: "#D1BEA6",
  },
  blush: {
    1: "#FCD2D0",
    2: "#F3B5B3",
    3: "#DF9996",
    4: "#AA615E",
  },
};

export type ColorTheme = {
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  border: string;
  inputBorder: string;
  textHeader: string;
  textSubHeader: string;
  textBody: string;
  textCaption: string;
  textDestructive: string;
  textHighlight: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  sensorHealth: {
    healthy: string;
    unhealthy: string;
    unknown: string;
    offline: string;
    degraded: string;
  };
};

export const COLORS_LIGHT: ColorTheme = {
  background: "rgb(254, 249, 243)",
  backgroundSecondary: "rgba(255, 255, 255, 0.6)",
  backgroundTertiary: "rgba(255, 255, 255, 0.9)",
  border: "white",
  inputBorder: "#E0E0E0",
  textHeader: "#121B03F5",
  textSubHeader: "#67727E",
  textBody: "#121B03F5",
  textCaption: "#929BA5",
  textHighlight: "#007AFF",
  textDestructive: colors.red["500"],
  colors: {
    primary: "#1D2C38",
    secondary: colors.amber[3],
    background: "#F4F5F6",
  },
  sensorHealth: {
    healthy: "#9ACD32",
    unhealthy: colors.red["500"],
    unknown: colors.gray["300"],
    offline: "#F22200",
    degraded: colors.orange["500"],
  },
};

export const COLORS_DARK: ColorTheme = {
  background: colors.gray["carbono"],
  backgroundSecondary: colors.gray["800"],
  backgroundTertiary: colors.gray["100"],
  border: colors.gray["700"],
  inputBorder: colors.gray["700"],
  textHeader: "#E6F1FF",
  textSubHeader: "#E6F1FF",
  textBody: "#E6F1FF",
  textCaption: "#929BA5",
  textHighlight: "#007AFF",
  textDestructive: colors.red["500"],
  colors: {
    primary: colors.blue["500"],
    secondary: colors.orange["500"],
    background: colors.gray["carbono"],
  },
  sensorHealth: {
    healthy: colors.green["500"],
    unhealthy: colors.red["400"],
    unknown: colors.gray["500"],
    offline: colors.red["400"],
    degraded: colors.orange["400"],
  },
};

export function useColors() {
  // const colorScheme = useColorScheme();
  return COLORS_LIGHT;
  // return colorScheme === 'dark' ? COLORS_DARK : COLORS_LIGHT;
}

// Contender for background
// backgroundColor: 'rgba(255, 255, 255, 0.1)'
