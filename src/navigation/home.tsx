import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
import {
  useHasOrgProduct,
  useNeedsOrgProduct,
} from "../context/OrgProductContext";

import OrgProductSelector from "../screens/OrgProductSelector";
import DevicesScreen from "../screens/DevicesScreen";
import DeviceDetailScreen from "../screens/DeviceDetailScreen";
import FirmwareScreen from "../screens/FirmwareScreen";
import DeploymentsScreen from "../screens/DeploymentsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { colors } from "../theme/colors";

// ── Devices stack (list + detail) ────────────────────────────────

const DevicesStack = createNativeStackNavigator({
  screens: {
    DevicesList: {
      screen: DevicesScreen,
      options: { headerShown: false },
    },
    DeviceDetail: {
      screen: DeviceDetailScreen,
      options: {
        title: "Device",
        headerTransparent: true,
        headerBlurEffect: "systemMaterial",
      },
    },
  },
});

// ── Main tabs (native platform tabs) ─────────────────────────────

const MainTabs = createNativeBottomTabNavigator({
  sidebarAdaptable: false,
  scrollEdgeAppearance: "opaque",
  translucent: true,
  tabBarActiveTintColor: colors.amber[4],
  tabBarInactiveTintColor: colors.gray[300],
  // tabLabelStyle: {
  //   fontSize: 10,
  //   fontWeight: "700",
  //   fontFamily: "Plus Jakarta Sans",
  // },
  screens: {
    Devices: {
      screen: DevicesStack,
      options: {
        tabBarIcon: ({ focused }) => ({
          sfSymbol: focused ? "cpu.fill" : "cpu",
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
    Settings: {
      screen: SettingsScreen,
      options: {
        tabBarIcon: ({ focused }) => ({
          sfSymbol: focused ? "gearshape.fill" : "gearshape",
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
