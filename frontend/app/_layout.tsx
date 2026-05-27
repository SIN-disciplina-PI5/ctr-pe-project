import "../global.css";

import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { queryClient } from "@/infrastructure/api/query-client";
import { NAV_THEME } from "@/lib/theme";

export default function RootLayout() {
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
