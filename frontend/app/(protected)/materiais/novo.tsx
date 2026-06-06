import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useCreateMaterial } from "@/features/materiais/materiais.hooks";

export default function NovoMaterialScreen() {
  const createMaterial = useCreateMaterial();

  const [empresaId, setEmpresaId] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [unidade, setUnidade] = useState("UN");
  const [estoqueAtual, setEstoqueAtual] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");
  const [custoMedio, setCustoMedio] = useState("");

  async function handleSubmit() {
    await createMaterial.mutateAsync({
      empresaId,
      codigo,
      nome,
      unidade,
      estoqueAtual: Number(estoqueAtual || 0),
      estoqueMinimo: Number(estoqueMinimo || 0),
      custoMedio: Number(custoMedio || 0),
      ativo: true,
    });

    router.back();
  }

  return (
    <ScrollView className="flex-1 bg-background px-4 py-6">
      <Text className="mb-6 text-2xl font-bold">Novo material</Text>

      <View className="gap-4">
        <View className="gap-2">
          <Text>Empresa ID</Text>
          <Input value={empresaId} onChangeText={setEmpresaId} placeholder="ID da empresa" />
        </View>

        <View className="gap-2">
          <Text>Código</Text>
          <Input value={codigo} onChangeText={setCodigo} placeholder="Ex: MAT-001" />
        </View>

        <View className="gap-2">
          <Text>Nome</Text>
          <Input value={nome} onChangeText={setNome} placeholder="Ex: Filtro de óleo" />
        </View>

        <View className="gap-2">
          <Text>Unidade</Text>
          <Input value={unidade} onChangeText={setUnidade} placeholder="UN" />
        </View>

        <View className="gap-2">
          <Text>Estoque atual</Text>
          <Input value={estoqueAtual} onChangeText={setEstoqueAtual} keyboardType="numeric" />
        </View>

        <View className="gap-2">
          <Text>Estoque mínimo</Text>
          <Input value={estoqueMinimo} onChangeText={setEstoqueMinimo} keyboardType="numeric" />
        </View>

        <View className="gap-2">
          <Text>Custo médio</Text>
          <Input value={custoMedio} onChangeText={setCustoMedio} keyboardType="numeric" />
        </View>

        <Button disabled={createMaterial.isPending} onPress={handleSubmit}>
          <Text>{createMaterial.isPending ? "Salvando..." : "Salvar"}</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
