import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { removeToken } from "@/infrastructure/storage/token-storage";
import { useAuthStore } from "@/store/auth-store";

export default function PerfilScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  async function handleLogout() {
    await removeToken();
    clearAuth();
    router.replace("/(auth)/login");
  }

  const initials = user?.nome
    ? user.nome
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
    : "??";

  return (
    <View className="flex-1 bg-background px-6 justify-center items-center">
      <View className="w-full max-w-sm">
        <Card className="border border-border/40 bg-card shadow-lg shadow-black/5 rounded-2xl">
          <CardHeader className="pt-6 pb-2">
            <CardTitle className="text-center text-lg font-semibold tracking-tight text-foreground">
              Meu Perfil
            </CardTitle>
          </CardHeader>

          <CardContent className="gap-6 p-6">
            <View className="items-center pb-5 border-b border-border/60 gap-2">
              <View className="h-20 w-20 rounded-full bg-muted/80 justify-center items-center mb-1 border border-border/20 shadow-sm">
                <Text className="text-2xl font-bold tracking-wider text-muted-foreground">
                  {initials}
                </Text>
              </View>
              <Text className="text-xl font-bold tracking-tight text-foreground">
                {user?.nome ?? "Usuario"}
              </Text>
              <Text className="text-xs font-medium text-muted-foreground/80 uppercase tracking-widest bg-muted/50 px-2.5 py-1 rounded-full overflow-hidden">
                {user?.perfil ?? "SEM PERFIL"}
              </Text>
            </View>

            <View className="gap-3.5 px-1">
              <View className="flex-row justify-between items-center">
                <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  E-mail
                </Text>
                <Text className="text-sm font-medium text-foreground/90">
                  {user?.email ?? "-"}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Empresa
                </Text>
                <Text className="text-sm font-medium text-foreground/90">
                  {user?.empresaId ?? "ADMIN GLOBAL"}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </Text>
                <Text className="text-sm font-medium text-foreground/90">
                  {user?.ativo ? "ATIVO" : "INATIVO"}
                </Text>
              </View>
            </View>

            <Button
              variant="destructive"
              className="w-full mt-2 h-12 rounded-xl active:opacity-90 shadow-sm"
              onPress={handleLogout}
            >
              <Text className="text-destructive-foreground font-semibold text-sm tracking-wide">
                Sair do Sistema
              </Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}