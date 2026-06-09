import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import React from "react";
import { PortalHost } from "@rn-primitives/portal";

import { queryClient } from "@/infrastructure/api/query-client";
import "../global.css";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
      <PortalHost />
    </QueryClientProvider>
  );
}