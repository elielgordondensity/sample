import React from "react";
import { LoadingView } from "../components/ui";
import { useIsAuthenticated } from "../context/AuthContext";
import AuthNavigator from "./auth";
import HomeNavigator from "./home";

export default function RootNavigator() {
  const { isLoading, isAuthenticated } = useIsAuthenticated();

  if (isLoading) return <LoadingView message="Loading…" />;

  return isAuthenticated ? <HomeNavigator /> : <AuthNavigator />;
}
