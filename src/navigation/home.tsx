import { Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { colors, typography } from "../components/tokens";
import { useHasOrgProduct, useNeedsOrgProduct } from "../context/OrgProductContext";

import OrgProductSelector from "../screens/OrgProductSelector";
import DevicesScreen from "../screens/DevicesScreen";
import FirmwareScreen from "../screens/FirmwareScreen";
import DeploymentsScreen from "../screens/DeploymentsScreen";

// ── Tab icon helper ──────────────────────────────────────────────

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      style={{
        ...typography.caption,
        fontSize: 18,
        color: focused ? colors.accent : colors.textTertiary,
      }}
    >
      {label}
    </Text>
  );
}

// ── Main tabs ────────────────────────────────────────────────────

const MainTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      borderTopWidth: 1,
    },
    tabBarActiveTintColor: colors.accent,
    tabBarInactiveTintColor: colors.textTertiary,
    tabBarLabelStyle: {
      ...typography.caption,
      marginTop: -2,
    },
  },
  screens: {
    Devices: {
      screen: DevicesScreen,
      options: {
        tabBarIcon: ({ focused }) => <TabIcon label="📱" focused={focused} />,
      },
    },
    Firmware: {
      screen: FirmwareScreen,
      options: {
        tabBarIcon: ({ focused }) => <TabIcon label="📦" focused={focused} />,
      },
    },
    Deployments: {
      screen: DeploymentsScreen,
      options: {
        tabBarIcon: ({ focused }) => <TabIcon label="🚀" focused={focused} />,
      },
    },
  },
});

// ── Home navigator ───────────────────────────────────────────────

const HomeNavigator = createNativeStackNavigator({
  screenOptions: { headerShown: false },
  screens: {
    OrgProduct: {
      if: useNeedsOrgProduct,
      screen: OrgProductSelector,
    },
    Main: {
      if: useHasOrgProduct,
      screen: MainTabs,
    },
  },
});

export default HomeNavigator;
