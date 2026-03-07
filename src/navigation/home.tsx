import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
import { colors } from "../components/tokens";
import { useHasOrgProduct, useNeedsOrgProduct } from "../context/OrgProductContext";

import OrgProductSelector from "../screens/OrgProductSelector";
import DevicesScreen from "../screens/DevicesScreen";
import FirmwareScreen from "../screens/FirmwareScreen";
import DeploymentsScreen from "../screens/DeploymentsScreen";

// ── Main tabs (native platform tabs) ─────────────────────────────

const MainTabs = createNativeBottomTabNavigator({
  screenOptions: {
    headerShown: false,
    tabBarActiveTintColor: colors.accent,
    tabBarInactiveTintColor: colors.textTertiary,
  },
  screens: {
    Devices: {
      screen: DevicesScreen,
      options: {
        tabBarIcon: ({ focused }) => ({
          sfSymbol: focused ? "iphone" : "iphone",
        }),
      },
    },
    Firmware: {
      screen: FirmwareScreen,
      options: {
        tabBarIcon: ({ focused }) => ({
          sfSymbol: focused ? "shippingbox.fill" : "shippingbox",
        }),
      },
    },
    Deployments: {
      screen: DeploymentsScreen,
      options: {
        tabBarIcon: ({ focused }) => ({
          sfSymbol: focused ? "paperplane.fill" : "paperplane",
        }),
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
