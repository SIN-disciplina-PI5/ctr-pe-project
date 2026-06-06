import { router } from "expo-router";
import { ActivityIndicator, FlatList, View } from "react-native";

import { AtivoCard } from "@/components/domain/ativo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAtivos } from "@/features/ativos/ativos.hooks";
import { useState } from "react";

export default function AtivosScreen() {
  const [search, setSearch] = useState("");
  const { data: ativos, isLoading, isError, refetch } = useAtivos({
    search: search || undefined,
  });

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
      <View className="mb-4 flex-row items-center justify-between gap-4">
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

      <View className="mb-4">
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nome ou código..."
        />
      </View>

      <FlatList
        data={ativos ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3 pb-8"
        renderItem={({ item }) => (
          <AtivoCard ativo={item} onPress={() => router.push(`/ativos/${item.id}`)} />
        )}
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