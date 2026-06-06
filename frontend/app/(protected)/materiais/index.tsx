import { router } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useMateriais } from "@/features/materiais/materiais.hooks";
import type { Material } from "@/features/materiais/materiais.types";

function MaterialCard({ material }: { material: Material }) {
  return (
    <Pressable
      className="rounded-xl border border-border bg-card p-4"
      onPress={() => router.push(`/materiais/${material.id}`)}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold">{material.nome}</Text>
          <Text className="text-sm text-muted-foreground">
            Código: {material.codigo}
          </Text>
        </View>

        <Text className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
          {material.ativo ? "ATIVO" : "INATIVO"}
        </Text>
      </View>

      <View className="mt-3 gap-1">
        <Text className="text-sm text-muted-foreground">
          Estoque: {material.estoqueAtual} {material.unidade}
        </Text>
        <Text className="text-sm text-muted-foreground">
          Mínimo: {material.estoqueMinimo} {material.unidade}
        </Text>
        <Text className="text-sm text-muted-foreground">
          Custo médio: R$ {material.custoMedio}
        </Text>
      </View>
    </Pressable>
  );
}

export default function MateriaisScreen() {
  const [search, setSearch] = useState("");
  const { data: materiais, isLoading, isError, refetch } = useMateriais({
    search: search || undefined,
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <ActivityIndicator />
        <Text className="mt-3 text-muted-foreground">Carregando materiais...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-xl font-semibold">Erro ao carregar materiais</Text>
        <Text className="mt-2 text-center text-muted-foreground">
          Não foi possível buscar os materiais cadastrados.
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
          <Text className="text-2xl font-bold">Materiais</Text>
          <Text className="text-sm text-muted-foreground">
            Peças e materiais usados nas ordens de serviço.
          </Text>
        </View>

        <Button onPress={() => router.push("/materiais/novo")}>
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
        data={materiais ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3 pb-8"
        renderItem={({ item }) => <MaterialCard material={item} />}
        ListEmptyComponent={
          <View className="items-center justify-center rounded-xl border border-dashed border-border p-8">
            <Text className="text-lg font-semibold">Nenhum material encontrado</Text>
            <Text className="mt-2 text-center text-muted-foreground">
              Cadastre o primeiro material para começar.
            </Text>
          </View>
        }
      />
    </View>
  );
}
