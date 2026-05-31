import { router } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAtivos } from "@/features/ativos/ativos.hooks";
import type { Ativo } from "@/features/ativos/ativos.types";

function AtivoItem({ ativo }: { ativo: Ativo }) {
  return (
    <Pressable
      className="rounded-xl border border-border bg-card p-4"
      onPress={() => router.push(`/ativos/${ativo.id}`)}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold">{ativo.nome}</Text>
          <Text className="text-sm text-muted-foreground">Código: {ativo.codigo}</Text>
        </View>

        <Text className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
          {ativo.status}
        </Text>
      </View>

      <View className="mt-3 gap-1">
        <Text className="text-sm text-muted-foreground">Tipo: {ativo.tipo}</Text>
        <Text className="text-sm text-muted-foreground">
          Criticidade: {ativo.criticidade}
        </Text>
      </View>
    </Pressable>
  );
}

export default function AtivosScreen() {
  const { data: ativos, isLoading, isError, refetch } = useAtivos();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <ActivityIndicator />
        <Text className="mt-3 text-muted-foreground">Carregando ativos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-xl font-semibold">Erro ao carregar ativos</Text>
        <Text className="mt-2 text-center text-muted-foreground">
          Não foi possível buscar os ativos cadastrados.
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
          <Text className="text-2xl font-bold">Ativos</Text>
          <Text className="text-sm text-muted-foreground">
            Máquinas, caminhões e equipamentos cadastrados.
          </Text>
        </View>

        <Button onPress={() => router.push("/ativos/novo")}>
          <Text>Novo</Text>
        </Button>
      </View>

      <FlatList
        data={ativos ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3 pb-8"
        renderItem={({ item }) => <AtivoItem ativo={item} />}
        ListEmptyComponent={
          <View className="items-center justify-center rounded-xl border border-dashed border-border p-8">
            <Text className="text-lg font-semibold">Nenhum ativo encontrado</Text>
            <Text className="mt-2 text-center text-muted-foreground">
              Cadastre o primeiro ativo para começar.
            </Text>
          </View>
        }
      />
    </View>
  );
}
