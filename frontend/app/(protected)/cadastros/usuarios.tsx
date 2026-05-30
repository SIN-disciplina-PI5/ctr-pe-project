import { useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, Alert, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUsuarios, useDeleteUsuario, useResetSenha } from "@/features/usuarios/usuarios.hooks";
import { useEmpresaStore } from "@/store/empresa-store";
import { resetSenhaSchema, type ResetSenhaFormData, PERFIS } from "@/features/usuarios/usuarios.schemas";
import type { PerfilUsuario } from "@/features/usuarios/usuarios.types";
import { RoleGate } from "@/components/domain/role-gate";

export default function UsuariosScreen() {
  const router = useRouter();
  const { empresaId } = useEmpresaStore();
  const [search, setSearch] = useState("");
  const [perfilFiltro, setPerfilFiltro] = useState<PerfilUsuario | undefined>();
  const [ativo, setAtivo] = useState<boolean | undefined>(undefined);
  const [resetId, setResetId] = useState<string | null>(null);

  const { data: usuarios, isLoading, isError } = useUsuarios({
    empresaId: empresaId ?? undefined,
    search,
    perfil: perfilFiltro,
    ativo,
  });
  const { mutate: deleteUsuario } = useDeleteUsuario();
  const { mutate: resetSenha, isPending: isResetting } = useResetSenha(resetId ?? "");

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ResetSenhaFormData>({
    resolver: zodResolver(resetSenhaSchema),
  });

  function handleInativar(id: string) {
    Alert.alert("Inativar usuário", "Confirmar inativação?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Inativar", style: "destructive", onPress: () => deleteUsuario(id) },
    ]);
  }

  function onSubmitReset(data: ResetSenhaFormData) {
    if (!resetId) return;
    resetSenha(
      { novaSenha: data.novaSenha },
      {
        onSuccess: () => {
          Alert.alert("Sucesso", "Senha redefinida.");
          setResetId(null);
          reset();
        },
        onError: () => Alert.alert("Erro", "Não foi possível redefinir a senha."),
      }
    );
  }

  return (
    <View className="flex-1 bg-background p-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-foreground text-xl font-bold">Usuários</Text>
        <RoleGate perfis={["ADMIN"]}>
          <Pressable
            onPress={() => router.push("/(protected)/cadastros/usuario-novo")}
            className="bg-primary px-4 py-2 rounded-md"
          >
            <Text className="text-primary-foreground text-sm font-medium">Novo usuário</Text>
          </Pressable>
        </RoleGate>
      </View>

      <TextInput
        placeholder="Buscar por nome ou e-mail..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
        className="border border-border rounded-md px-3 py-2 mb-3 text-foreground bg-card"
      />

      {/* Filtro por perfil */}
      <View className="flex-row flex-wrap gap-2 mb-3">
        <Pressable
          onPress={() => setPerfilFiltro(undefined)}
          className={`px-3 py-1 rounded-full border ${perfilFiltro === undefined ? "bg-primary border-primary" : "border-border bg-card"}`}
        >
          <Text className={`text-xs ${perfilFiltro === undefined ? "text-primary-foreground" : "text-foreground"}`}>
            Todos
          </Text>
        </Pressable>
        {PERFIS.map((p) => (
          <Pressable
            key={p}
            onPress={() => setPerfilFiltro(p as PerfilUsuario)}
            className={`px-3 py-1 rounded-full border ${perfilFiltro === p ? "bg-primary border-primary" : "border-border bg-card"}`}
          >
            <Text className={`text-xs ${perfilFiltro === p ? "text-primary-foreground" : "text-foreground"}`}>
              {p}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Filtro ativo/inativo */}
      <View className="flex-row gap-2 mb-4">
        {[{ label: "Todos", value: undefined }, { label: "Ativos", value: true }, { label: "Inativos", value: false }].map((op) => (
          <Pressable
            key={String(op.value)}
            onPress={() => setAtivo(op.value)}
            className={`px-3 py-1 rounded-full border ${ativo === op.value ? "bg-primary border-primary" : "border-border bg-card"}`}
          >
            <Text className={`text-xs ${ativo === op.value ? "text-primary-foreground" : "text-foreground"}`}>
              {op.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading && <Text className="text-muted-foreground text-center">Carregando...</Text>}
      {isError && <Text className="text-destructive text-center">Erro ao carregar usuários.</Text>}

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-card border border-border rounded-lg p-4 mb-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-foreground font-semibold">{item.nome}</Text>
              <View className={`px-2 py-0.5 rounded-full ${item.ativo ? "bg-green-100" : "bg-muted"}`}>
                <Text className={`text-xs ${item.ativo ? "text-green-700" : "text-muted-foreground"}`}>
                  {item.ativo ? "Ativo" : "Inativo"}
                </Text>
              </View>
            </View>
            <Text className="text-muted-foreground text-sm">{item.email}</Text>
            <View className="bg-muted px-2 py-0.5 rounded self-start mt-1">
              <Text className="text-muted-foreground text-xs">{item.perfil}</Text>
            </View>
            <View className="flex-row gap-3 mt-3">
              <RoleGate perfis={["ADMIN"]}>
                <Pressable onPress={() => router.push(`/(protected)/cadastros/usuario-editar?id=${item.id}`)}>
                  <Text className="text-primary text-sm">Editar</Text>
                </Pressable>
              </RoleGate>
              <RoleGate perfis={["ADMIN"]}>
                <Pressable onPress={() => { setResetId(item.id); reset(); }}>
                  <Text className="text-primary text-sm">Resetar senha</Text>
                </Pressable>
              </RoleGate>
              <RoleGate perfis={["ADMIN"]}>
                <Pressable onPress={() => handleInativar(item.id)}>
                  <Text className="text-destructive text-sm">Inativar</Text>
                </Pressable>
              </RoleGate>
            </View>
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <Text className="text-muted-foreground text-center mt-8">Nenhum usuário encontrado.</Text>
          ) : null
        }
      />

      {/* Modal reset de senha */}
      <Modal visible={!!resetId} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center p-4">
          <View className="bg-card rounded-xl p-6 w-full max-w-sm">
            <Text className="text-foreground text-lg font-bold mb-4">Redefinir senha</Text>

            <Text className="text-foreground text-sm mb-1">Nova senha</Text>
            <Controller
              control={control}
              name="novaSenha"
              render={({ field }) => (
                <TextInput
                  secureTextEntry
                  value={field.value}
                  onChangeText={field.onChange}
                  className="border border-border rounded-md px-3 py-2 mb-1 text-foreground bg-background"
                />
              )}
            />
            {errors.novaSenha && (
              <Text className="text-destructive text-xs mb-2">{errors.novaSenha.message}</Text>
            )}

            <Text className="text-foreground text-sm mb-1">Confirmação</Text>
            <Controller
              control={control}
              name="confirmacao"
              render={({ field }) => (
                <TextInput
                  secureTextEntry
                  value={field.value}
                  onChangeText={field.onChange}
                  className="border border-border rounded-md px-3 py-2 mb-1 text-foreground bg-background"
                />
              )}
            />
            {errors.confirmacao && (
              <Text className="text-destructive text-xs mb-4">{errors.confirmacao.message}</Text>
            )}

            <View className="flex-row gap-3 mt-2">
              <Pressable
                onPress={() => { setResetId(null); reset(); }}
                className="flex-1 border border-border py-2 rounded-md items-center"
              >
                <Text className="text-foreground text-sm">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit(onSubmitReset)}
                disabled={isResetting}
                className="flex-1 bg-primary py-2 rounded-md items-center"
              >
                <Text className="text-primary-foreground text-sm font-semibold">
                  {isResetting ? "Salvando..." : "Confirmar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}