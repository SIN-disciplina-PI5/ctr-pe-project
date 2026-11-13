import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Slot, useRouter } from "expo-router";

import { ProtectedShell } from "@/components/layout/protected-shell";
import { authService } from "@/infrastructure/auth/auth.service";
import {
  clearSession,
  getRefreshToken,
  getToken,
} from "@/infrastructure/storage/token-storage";
import { useAuthStore } from "@/store/auth-store";

export default function ProtectedLayout() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      if (user) {
        setSessionReady(true);
        return;
      }

      try {
        const [token, refreshToken] = await Promise.all([
          getToken(),
          getRefreshToken(),
        ]);

        if (!token || !refreshToken) {
          throw new Error("Sessão não encontrada.");
        }

        const currentUser = await authService.me();

        if (active) {
          setAuth(token, refreshToken, currentUser);
          setSessionReady(true);
        }
      } catch {
        await clearSession();
        clearAuth();

        if (active) {
          router.replace("/(auth)/login");
        }
      }
    }

    void restoreSession();

    return () => {
      active = false;
    };
  }, [clearAuth, router, setAuth, user]);

  if (!sessionReady) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ProtectedShell>
      <Slot />
    </ProtectedShell>
  );
}
