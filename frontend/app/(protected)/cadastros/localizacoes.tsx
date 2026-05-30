import { useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useLocalizacoes, useDeleteLocalizacao } from "@/features/localizacoes/localizacoes.hooks";
import { useEmpresas } from "@/features/empresas/empresas.hooks";
import { useEmpresaStore } from "@/store/empresa-store";

export default function LocalizacoesScreen() {
  const router = useRouter();
  const { empresaId } = useEmpresaStore();
  const [search, setSearch] = useState("");
  const [ativa, setAtiva] = useState<boolean | undefined>(undefined);

  const { data: empresas } = useEmpresas({ ativa: true });
  const { data: localizacoes, isLoading, isError } = useLocalizacoes({
    empresaId: empresaId ?? undefined,
    search,
    ativa,
  });
  const { mutate: deleteLocalizacao } = useDeleteLocalizacao();

  function handleInativar(id: string) {
    Alert.alert("Inativar localização", "Confirmar inativação?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Inativar", style: "destructive", onPress: () => deleteLocalizacao(id) },
    ]);
  }

  return (
    <View className="flex-1 bg-background p-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-foreground text-xl font-bold">Localizações</Text>
        <Pressable
          onPress={() => router.push("/(protected)/cadastros/localizacao-nova")}
          className="bg-primary px-4 py-2 rounded-md"
        >
          <Text className="text-primary-foreground text-sm font-medium">Nova localização</Text>
        </Pressable>
      </View>

      <TextInput
        placeholder="Buscar por nome..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
        className="border border-border rounded-md px-3 py-2 mb-3 text-foreground bg-card"
      />

      <View className="flex-row gap-2 mb-4">
        {[
          { label: "Todas", value: undefined },
          { label: "Ativas", value: true },
          { label: "Inativas", value: false },
        ].map((op) => (
          <Pressable
            key={String(op.value)}
            onPress={() => setAtiva(op.value)}
            className={`px-3 py-1 rounded-full border ${
              ativa === op.value ? "bg-primary border-primary" : "border-border bg-card"
            }`}
          >
            <Text
              className={
                ativa === op.value ? "text-primary-foreground text-xs" : "text-foreground text-xs"
              }
            >
              {op.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading && <Text className="text-muted-foreground text-center">Carregando...</Text>}
      {isError && <Text className="text-destructive text-center">Erro ao carregar localizações.</Text>}

      <FlatList
        data={localizacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-card border border-border rounded-lg p-4 mb-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-foreground font-semibold">{item.nome}</Text>
              <View
                className={`px-2 py-0.5 rounded-full ${item.ativa ? "bg-green-100" : "bg-muted"}`}
              >
                <Text className={`text-xs ${item.ativa ? "text-green-700" : "text-muted-foreground"}`}>
                  {item.ativa ? "Ativa" : "Inativa"}
                </Text>
              </View>
            </View>
            {item.codigo && (
              <Text className="text-muted-foreground text-sm">{item.codigo}</Text>
            )}
            {item.tipo && (
              <Text className="text-muted-foreground text-xs mb-2">{item.tipo}</Text>
            )}
            <View className="flex-row gap-3 mt-2">
              <Pressable
                onPress={() =>
                  router.push(`/(protected)/cadastros/localizacao-editar?id=${item.id}`)
                }
              >
                <Text className="text-primary text-sm">Editar</Text>
              </Pressable>
              <Pressable onPress={() => handleInativar(item.id)}>
                <Text className="text-destructive text-sm">Inativar</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <Text className="text-muted-foreground text-center mt-8">
              Nenhuma localização encontrada.
            </Text>
          ) : null
        }
      />
    </View>
  );
}