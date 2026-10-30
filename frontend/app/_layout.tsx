import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { PortalHost } from "@rn-primitives/portal";

import { queryClient } from "@/infrastructure/api/query-client";
import "../global.css";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "web" && __DEV__) {
      const script = document.createElement("script");
      script.src = "http://localhost:3000/hook.js";
      document.body.appendChild(script);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
      <PortalHost />
    </QueryClientProvider>
  );
}