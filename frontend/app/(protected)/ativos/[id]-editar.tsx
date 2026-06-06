import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAtivo, useUpdateAtivo } from "@/features/ativos/ativos.hooks";
import type { TipoAtivo } from "@/features/ativos/ativos.types";

export default function EditarAtivoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: ativo, isLoading } = useAtivo(id);
  const updateAtivo = useUpdateAtivo(id);

  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<TipoAtivo>("MAQUINA");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");

  useEffect(() => {
    if (!ativo) return;

    setCodigo(ativo.codigo);
    setNome(ativo.nome);
    setTipo(ativo.tipo);
    setMarca(ativo.marca ?? "");
    setModelo(ativo.modelo ?? "");
  }, [ativo]);

  async function handleSubmit() {
    await updateAtivo.mutateAsync({
      codigo,
      nome,
      tipo,
      marca,
      modelo,
    });

    router.back();
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <ActivityIndicator />
        <Text className="mt-3 text-muted-foreground">Carregando ativo...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background px-4 py-6">
      <Text className="mb-6 text-2xl font-bold">Editar ativo</Text>

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
          <Text>Tipo</Text>
          <Input value={tipo} onChangeText={(value) => setTipo(value as TipoAtivo)} />
        </View>

        <View className="gap-2">
          <Text>Marca</Text>
          <Input value={marca} onChangeText={setMarca} />
        </View>

        <View className="gap-2">
          <Text>Modelo</Text>
          <Input value={modelo} onChangeText={setModelo} />
        </View>

        <Button disabled={updateAtivo.isPending} onPress={handleSubmit}>
          <Text>{updateAtivo.isPending ? "Salvando..." : "Salvar alterações"}</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
