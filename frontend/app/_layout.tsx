import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import React from "react";
import { PortalHost } from "@rn-primitives/portal";

import { ToastHost } from "@/components/feedback/toast-host";
import { queryClient } from "@/infrastructure/api/query-client";
import { installWebAlert } from "@/lib/web-alert";
import "../global.css";

installWebAlert();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
      <PortalHost />
      <ToastHost />
    </QueryClientProvider>
  );
}