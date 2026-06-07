import { router } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

import { AlertaCard } from "@/components/domain/alerta-card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAlertas } from "@/features/alertas/alertas.hooks";
import { useSelectedEmpresaId } from "@/hooks/use-selected-empresa";

export default function AlertasScreen() {
  const empresaId = useSelectedEmpresaId();

  const filters = useMemo(
    () => ({
      empresaId: empresaId ?? undefined,
    }),
    [empresaId],
  );

  const { data: alertas, isLoading, isError, refetch } = useAlertas(filters);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <ActivityIndicator />
        <Text className="mt-3 text-muted-foreground">Carregando alertas...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-xl font-semibold">Erro ao carregar alertas</Text>
        <Text className="mt-2 text-center text-muted-foreground">
          Não foi possível buscar os alertas.
        </Text>
        <Button className="mt-4" onPress={() => refetch()}>
          <Text>Tentar novamente</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 py-6">
      <View className="mb-4 flex-row items-center justify-between gap-4">
        <View className="flex-1">
          <Text className="text-2xl font-bold">Alertas</Text>
          <Text className="text-sm text-muted-foreground">
            Alertas operacionais e preventivos do sistema.
          </Text>
        </View>

        <Button variant="outline" onPress={() => router.push("/(protected)/alertas/me")}>
          <Text>Meus alertas</Text>
        </Button>
      </View>

      <FlatList
        data={alertas ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3 pb-8"
        renderItem={({ item }) => <AlertaCard alerta={item} />}
        ListEmptyComponent={
          <View className="items-center justify-center rounded-xl border border-dashed border-border p-8">
            <Text className="text-lg font-semibold">Nenhum alerta encontrado</Text>
            <Text className="mt-2 text-center text-muted-foreground">
              Quando houver ocorrências, elas aparecerão aqui.
            </Text>
          </View>
        }
      />
    </View>
  );
}