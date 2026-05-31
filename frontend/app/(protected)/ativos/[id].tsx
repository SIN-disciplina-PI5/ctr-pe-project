import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAtivo, useUpdateAtivoStatus } from "@/features/ativos/ativos.hooks";
import type { StatusAtivo } from "@/features/ativos/ativos.types";

const STATUS_OPTIONS: StatusAtivo[] = [
  "DISPONIVEL",
  "EM_USO",
  "PARADO",
  "EM_MANUTENCAO",
  "AGUARDANDO_PECA",
  "DESATIVADO",
];

export default function AtivoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: ativo, isLoading, isError, refetch } = useAtivo(id);
  const updateStatus = useUpdateAtivoStatus(id);

  async function handleChangeStatus(status: StatusAtivo) {
    await updateStatus.mutateAsync({ status });
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <ActivityIndicator />
        <Text className="mt-3 text-muted-foreground">Carregando ativo...</Text>
      </View>
    );
  }

  if (isError || !ativo) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-xl font-semibold">Erro ao carregar ativo</Text>
        <Text className="mt-2 text-center text-muted-foreground">
          Não foi possível buscar os dados deste ativo.
        </Text>
        <Button className="mt-4" onPress={() => refetch()}>
          <Text>Tentar novamente</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 py-6">
      <View className="mb-6 flex-row items-center justify-between gap-4">
        <View className="flex-1">
          <Text className="text-2xl font-bold">{ativo.nome}</Text>
          <Text className="text-sm text-muted-foreground">Código: {ativo.codigo}</Text>
        </View>

        <Button onPress={() => router.push(`/ativos/${ativo.id}-editar`)}>
          <Text>Editar</Text>
        </Button>
      </View>

      <View className="gap-3 rounded-xl border border-border bg-card p-4">
        <Text>Status: {ativo.status}</Text>
        <Text>Tipo: {ativo.tipo}</Text>
        <Text>Criticidade: {ativo.criticidade}</Text>
        <Text>Marca: {ativo.marca ?? "-"}</Text>
        <Text>Modelo: {ativo.modelo ?? "-"}</Text>
        <Text>Placa: {ativo.placa ?? "-"}</Text>
        <Text>Número de série: {ativo.numeroSerie ?? "-"}</Text>
        <Text>Descrição: {ativo.descricao ?? "-"}</Text>
      </View>

      <View className="mt-6 gap-3 rounded-xl border border-border bg-card p-4">
        <Text className="text-lg font-semibold">Alterar status</Text>

        <View className="flex-row flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <Button
              key={status}
              variant={ativo.status === status ? "default" : "outline"}
              disabled={updateStatus.isPending || ativo.status === status}
              onPress={() => handleChangeStatus(status)}
            >
              <Text>{status}</Text>
            </Button>
          ))}
        </View>
      </View>
    </View>
  );
}
