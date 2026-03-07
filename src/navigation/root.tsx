import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStaticNavigation } from "@react-navigation/native";
import { LoadingView } from "../components/ui";
import {
  useAuth,
  useIsSignedIn,
  useIsSignedOut,
} from "../context/AuthContext";
import AuthNavigator from "./auth";
import HomeNavigator from "./home";

const RootStack = createNativeStackNavigator({
  screenOptions: { headerShown: false },
  layout: ({ children }) => {
    const { isLoading } = useAuth();
    if (isLoading) return <LoadingView message="Loading…" />;
    return <>{children}</>;
  },
  screens: {
    Auth: {
      if: useIsSignedOut,
      screen: AuthNavigator,
    },
    Home: {
      if: useIsSignedIn,
      screen: HomeNavigator,
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
