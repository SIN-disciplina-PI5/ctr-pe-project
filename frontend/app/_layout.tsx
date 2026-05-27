import "../global.css";
import { useEffect } from "react";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { queryClient } from "@/infrastructure/api/query-client";
import { useAuth } from "@/hooks/use-auth"; 
import { NAV_THEME } from "@/lib/theme";

export default function RootLayout() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inProtectedGroup = segments[0] === "(protected)";

    if (!isAuthenticated && inProtectedGroup) {
      router.replace("/(auth)/index");
    } 
    else if (isAuthenticated && segments[0] === "(auth)") {
      router.replace("/(protected)/(tabs)/dashboard");
    }
  }, [isAuthenticated, segments]);

  return (
    <ThemeProvider value={NAV_THEME.light}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
        <PortalHost />
      </QueryClientProvider>
    </ThemeProvider>
  );
}