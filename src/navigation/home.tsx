import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { colors, typography } from "../components/tokens";
import { useIsAuthenticated } from "../context/AuthContext";

import OrgProductSelector from "../screens/OrgProductSelector";
import DevicesScreen from "../screens/DevicesScreen";
import FirmwareScreen from "../screens/FirmwareScreen";
import DeploymentsScreen from "../screens/DeploymentsScreen";

// ── Type definitions ─────────────────────────────────────────────

export type HomeStackParamList = {
  OrgProduct: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Devices: undefined;
  Firmware: undefined;
  Deployments: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

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

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
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
      }}
    >
      <Tab.Screen
        name="Devices"
        component={DevicesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="📱" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Firmware"
        component={FirmwareScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="📦" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Deployments"
        component={DeploymentsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="🚀" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ── Home navigator ───────────────────────────────────────────────

export default function HomeNavigator() {
  const { hasOrgProduct } = useIsAuthenticated();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasOrgProduct ? (
        <Stack.Screen name="OrgProduct" component={OrgProductSelector} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}
