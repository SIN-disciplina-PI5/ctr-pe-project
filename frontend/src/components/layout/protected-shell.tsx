import { useState, type ReactNode } from "react";
import { Alert, Pressable, View, useWindowDimensions } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Bell, Menu } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Logo } from "@/components/brand/logo";
import { Sidebar } from "@/components/layout/sidebar";
import { Icon } from "@/components/ui/icon";
import { authService } from "@/infrastructure/auth/auth.service";
import { clearSession, getRefreshToken } from "@/infrastructure/storage/token-storage";
import { useAuthStore } from "@/store/auth-store";
import { useEmpresaStore } from "@/store/empresa-store";

export function ProtectedShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const desktop = width >= 768;
  const [menuAberto, setMenuAberto] = useState(false);

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setEmpresaId = useEmpresaStore((state) => state.setEmpresaId);

  async function handleLogout() {
    try {
      const refreshToken = await getRefreshToken();

      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      Alert.alert("Aviso", "A sessão local será encerrada mesmo sem resposta do servidor.");
    } finally {
      await clearSession();
      clearAuth();
      setEmpresaId(null);
      router.replace("/(auth)/login");
    }
  }

  function irPara(href: string) {
    setMenuAberto(false);
    router.push(href);
  }

  const sidebar = (
    <Sidebar
      pathname={pathname}
      nomeUsuario={user?.nome}
      perfilUsuario={user?.perfil}
      onNavigate={irPara}
      onLogout={handleLogout}
    />
  );

  if (desktop) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 flex-row overflow-hidden bg-background">
          <View className="w-[264px]">{sidebar}</View>
          <View className="flex-1 bg-background">{children}</View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#131316]">
      <View className="flex-1 overflow-hidden">
        <View className="h-14 flex-row items-center justify-between bg-[#131316] px-4">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => setMenuAberto(true)}
              className="h-9 w-9 items-center justify-center rounded-xl bg-white/5"
            >
              <Icon as={Menu} size={18} className="text-zinc-200" />
            </Pressable>
            <Logo claro showName size={28} />
          </View>
          <Pressable
            onPress={() => irPara("/alertas/me")}
            className="h-9 w-9 items-center justify-center rounded-xl bg-white/5"
          >
            <Icon as={Bell} size={16} className="text-zinc-200" />
          </Pressable>
        </View>

        <View className="flex-1 bg-background">{children}</View>

        {menuAberto ? (
          <View
            className="absolute bottom-0 left-0 right-0 top-0 flex-row"
            style={{ zIndex: 40 }}
          >
            <View className="w-[288px] max-w-[85%]">{sidebar}</View>
            <Pressable className="flex-1 bg-black/60" onPress={() => setMenuAberto(false)} />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
