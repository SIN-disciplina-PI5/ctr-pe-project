import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useCreateAtivo } from "@/features/ativos/ativos.hooks";
import type { TipoAtivo } from "@/features/ativos/ativos.types";

export default function NovoAtivoScreen() {
  const createAtivo = useCreateAtivo();

  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [empresaId, setEmpresaId] = useState("");
  const [tipo, setTipo] = useState<TipoAtivo>("MAQUINA");

  async function handleSubmit() {
    await createAtivo.mutateAsync({
      empresaId,
      codigo,
      nome,
      tipo,
      criticidade: "MEDIA",
      status: "DISPONIVEL",
    });

    router.back();
  }

  return (
    <ScrollView className="flex-1 bg-background px-4 py-6">
      <Text className="mb-6 text-2xl font-bold">Novo ativo</Text>

      <View className="gap-4">
        <View className="gap-2">
          <Text>Empresa ID</Text>
          <Input value={empresaId} onChangeText={setEmpresaId} placeholder="ID da empresa" />
        </View>

        <View className="gap-2">
          <Text>Código</Text>
          <Input value={codigo} onChangeText={setCodigo} placeholder="Ex: ATV-001" />
        </View>

        <View className="gap-2">
          <Text>Nome</Text>
          <Input value={nome} onChangeText={setNome} placeholder="Ex: Escavadeira 01" />
        </View>

        <View className="gap-2">
          <Text>Tipo</Text>
          <Input value={tipo} onChangeText={(value) => setTipo(value as TipoAtivo)} />
        </View>

        <Button disabled={createAtivo.isPending} onPress={handleSubmit}>
          <Text>{createAtivo.isPending ? "Salvando..." : "Salvar"}</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
