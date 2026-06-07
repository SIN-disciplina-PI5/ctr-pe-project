import { Slot } from "expo-router";

import { ProtectedShell } from "@/components/layout/protected-shell";

export default function ProtectedLayout() {
  return (
    <ProtectedShell>
      <Slot />
    </ProtectedShell>
  );
}