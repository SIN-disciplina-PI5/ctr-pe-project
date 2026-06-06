import { useRouter } from "expo-router";
import { View } from "react-native";

import { EmpresaSelector } from "@/components/domain/empresa-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/store/auth-store";

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  return (
    <View className="flex-1 bg-background px-6 py-6 gap-4">
      <View className="gap-1">
        <Text className="text-2xl font-bold text-foreground">Home</Text>
        <Text className="text-sm text-muted-foreground">
          {user ? `Logado como ${user.nome} (${user.perfil})` : "Sessao ativa"}
        </Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Empresa ativa</CardTitle>
        </CardHeader>
        <CardContent>
          <EmpresaSelector />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cadastros</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          <Button onPress={() => router.push("/(protected)/cadastros/empresas")}>
            <Text>Ver empresas</Text>
          </Button>

          <Button
            variant="outline"
            onPress={() => router.push("/(protected)/cadastros/localizacoes")}
          >
            <Text>Ver localizacoes</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}