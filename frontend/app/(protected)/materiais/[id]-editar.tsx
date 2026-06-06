import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useMaterial, useUpdateMaterial } from "@/features/materiais/materiais.hooks";

export default function EditarMaterialScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: material, isLoading } = useMaterial(id);
  const updateMaterial = useUpdateMaterial(id);

  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [unidade, setUnidade] = useState("UN");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");
  const [custoMedio, setCustoMedio] = useState("");

  useEffect(() => {
    if (!material) return;

    setCodigo(material.codigo);
    setNome(material.nome);
    setDescricao(material.descricao ?? "");
    setUnidade(material.unidade);
    setEstoqueMinimo(String(material.estoqueMinimo ?? ""));
    setCustoMedio(String(material.custoMedio ?? ""));
  }, [material]);

  async function handleSubmit() {
    await updateMaterial.mutateAsync({
      codigo,
      nome,
      descricao,
      unidade,
      estoqueMinimo: Number(estoqueMinimo || 0),
      custoMedio: Number(custoMedio || 0),
    });

    router.back();
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <ActivityIndicator />
        <Text className="mt-3 text-muted-foreground">Carregando material...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background px-4 py-6">
      <Text className="mb-6 text-2xl font-bold">Editar material</Text>

      <View className="gap-4">
        <View className="gap-2">
          <Text>Código</Text>
          <Input value={codigo} onChangeText={setCodigo} />
        </View>

        <View className="gap-2">
          <Text>Nome</Text>
          <Input value={nome} onChangeText={setNome} />
        </View>

        <View className="gap-2">
          <Text>Descrição</Text>
          <Input value={descricao} onChangeText={setDescricao} />
        </View>

        <View className="gap-2">
          <Text>Unidade</Text>
          <Input value={unidade} onChangeText={setUnidade} />
        </View>

        <View className="gap-2">
          <Text>Estoque mínimo</Text>
          <Input value={estoqueMinimo} onChangeText={setEstoqueMinimo} keyboardType="numeric" />
        </View>

        <View className="gap-2">
          <Text>Custo médio</Text>
          <Input value={custoMedio} onChangeText={setCustoMedio} keyboardType="numeric" />
        </View>

        <Button disabled={updateMaterial.isPending} onPress={handleSubmit}>
          <Text>{updateMaterial.isPending ? "Salvando..." : "Salvar alterações"}</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
