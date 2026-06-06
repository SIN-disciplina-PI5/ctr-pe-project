import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  useMaterial,
  useUpdateMaterialEstoque,
} from "@/features/materiais/materiais.hooks";

export default function MaterialDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: material, isLoading, isError, refetch } = useMaterial(id);
  const updateEstoque = useUpdateMaterialEstoque(id);

  const [quantidade, setQuantidade] = useState("");
  const [novoEstoque, setNovoEstoque] = useState("");

  async function handleEntrada() {
    await updateEstoque.mutateAsync({
      operacao: "ENTRADA",
      quantidade: Number(quantidade),
      motivo: "Entrada manual pelo app",
    });

    setQuantidade("");
  }

  async function handleSaida() {
    await updateEstoque.mutateAsync({
      operacao: "SAIDA",
      quantidade: Number(quantidade),
      motivo: "Saída manual pelo app",
    });

    setQuantidade("");
  }

  async function handleAjuste() {
    await updateEstoque.mutateAsync({
      operacao: "AJUSTE",
      novoEstoque: Number(novoEstoque),
      motivo: "Ajuste manual pelo app",
    });

    setNovoEstoque("");
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <ActivityIndicator />
        <Text className="mt-3 text-muted-foreground">Carregando material...</Text>
      </View>
    );
  }

  if (isError || !material) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-xl font-semibold">Erro ao carregar material</Text>
        <Text className="mt-2 text-center text-muted-foreground">
          Não foi possível buscar os dados deste material.
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
          <Text className="text-2xl font-bold">{material.nome}</Text>
          <Text className="text-sm text-muted-foreground">
            Código: {material.codigo}
          </Text>
        </View>

        <Button onPress={() => router.push(`/materiais/${material.id}-editar`)}>
          <Text>Editar</Text>
        </Button>
      </View>

      <View className="gap-3 rounded-xl border border-border bg-card p-4">
        <Text>Status: {material.ativo ? "ATIVO" : "INATIVO"}</Text>
        <Text>Unidade: {material.unidade}</Text>
        <Text>Estoque atual: {material.estoqueAtual}</Text>
        <Text>Estoque mínimo: {material.estoqueMinimo}</Text>
        <Text>Custo médio: R$ {material.custoMedio}</Text>
        <Text>Descrição: {material.descricao ?? "-"}</Text>
      </View>

      <View className="mt-6 gap-4 rounded-xl border border-border bg-card p-4">
        <Text className="text-lg font-semibold">Controle de estoque</Text>

        <View className="gap-2">
          <Text>Quantidade</Text>
          <Input
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="numeric"
            placeholder="Ex: 5"
          />
        </View>

        <View className="flex-row flex-wrap gap-2">
          <Button
            disabled={updateEstoque.isPending || !quantidade}
            onPress={handleEntrada}
          >
            <Text>Entrada</Text>
          </Button>

          <Button
            variant="outline"
            disabled={updateEstoque.isPending || !quantidade}
            onPress={handleSaida}
          >
            <Text>Saída</Text>
          </Button>
        </View>

        <View className="gap-2">
          <Text>Novo estoque</Text>
          <Input
            value={novoEstoque}
            onChangeText={setNovoEstoque}
            keyboardType="numeric"
            placeholder="Ex: 10"
          />
        </View>

        <Button
          variant="outline"
          disabled={updateEstoque.isPending || !novoEstoque}
          onPress={handleAjuste}
        >
          <Text>Ajustar estoque</Text>
        </Button>
      </View>
    </View>
  );
}
