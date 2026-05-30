import { useEffect } from "react";
import { View, Text, TextInput, Pressable, Switch, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUsuario, useUpdateUsuario } from "@/features/usuarios/usuarios.hooks";
import { useEmpresas } from "@/features/empresas/empresas.hooks";
import {
  updateUsuarioSchema,
  type UpdateUsuarioFormData,
  PERFIS,
} from "@/features/usuarios/usuarios.schemas";
import type { PerfilUsuario } from "@/features/usuarios/usuarios.types";

export default function UsuarioEditarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: usuario, isLoading } = useUsuario(id);
  const { data: empresas } = useEmpresas({ ativa: true });
  const { mutate: updateUsuario, isPending } = useUpdateUsuario(id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUsuarioFormData>({
    resolver: zodResolver(updateUsuarioSchema),
  });

  useEffect(() => {
    if (usuario) {
      reset({
        empresaId: usuario.empresaId ?? "",
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        ativo: usuario.ativo,
      });
    }
  }, [usuario]);

  function onSubmit(data: UpdateUsuarioFormData) {
    updateUsuario(data, {
      onSuccess: () => {
        Alert.alert("Sucesso", "Usuário atualizado.");
        router.back();
      },
      onError: () => Alert.alert("Erro", "Não foi possível atualizar o usuário."),
    });
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Carregando...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-foreground text-xl font-bold mb-6">Editar usuário</Text>

      {/* Empresa */}
      <Text className="text-foreground text-sm mb-1">Empresa *</Text>
      <Controller
        control={control}
        name="empresaId"
        render={({ field }) => (
          <View className="flex-row flex-wrap gap-2 mb-1">
            {empresas?.map((e) => (
              <Pressable
                key={e.id}
                onPress={() => field.onChange(e.id)}
                className={`px-3 py-1.5 rounded-md border ${
                  field.value === e.id ? "bg-primary border-primary" : "border-border bg-card"
                }`}
              >
                <Text className={field.value === e.id ? "text-primary-foreground text-sm" : "text-foreground text-sm"}>
                  {e.nome}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      />
      {errors.empresaId && <Text className="text-destructive text-xs mb-3">{errors.empresaId.message}</Text>}

      {/* Nome */}
      <Text className="text-foreground text-sm mb-1 mt-2">Nome *</Text>
      <Controller
        control={control}
        name="nome"
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            className="border border-border rounded-md px-3 py-2 mb-1 text-foreground bg-card"
          />
        )}
      />
      {errors.nome && <Text className="text-destructive text-xs mb-3">{errors.nome.message}</Text>}

      {/* E-mail */}
      <Text className="text-foreground text-sm mb-1">E-mail *</Text>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            value={field.value}
            onChangeText={field.onChange}
            className="border border-border rounded-md px-3 py-2 mb-1 text-foreground bg-card"
          />
        )}
      />
      {errors.email && <Text className="text-destructive text-xs mb-3">{errors.email.message}</Text>}

      {/* Perfil */}
      <Text className="text-foreground text-sm mb-1">Perfil *</Text>
      <Controller
        control={control}
        name="perfil"
        render={({ field }) => (
          <View className="flex-row flex-wrap gap-2 mb-1">
            {PERFIS.map((p) => (
              <Pressable
                key={p}
                onPress={() => field.onChange(p as PerfilUsuario)}
                className={`px-3 py-1.5 rounded-md border ${
                  field.value === p ? "bg-primary border-primary" : "border-border bg-card"
                }`}
              >
                <Text className={field.value === p ? "text-primary-foreground text-sm" : "text-foreground text-sm"}>
                  {p}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      />
      {errors.perfil && <Text className="text-destructive text-xs mb-3">{errors.perfil.message}</Text>}

      {/* Ativo */}
      <View className="flex-row items-center justify-between mb-6 mt-2">
        <Text className="text-foreground text-sm">Ativo</Text>
        <Controller
          control={control}
          name="ativo"
          render={({ field }) => <Switch value={field.value} onValueChange={field.onChange} />}
        />
      </View>

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
        className="bg-primary py-3 rounded-md items-center"
      >
        <Text className="text-primary-foreground font-semibold">
          {isPending ? "Salvando..." : "Salvar"}
        </Text>
      </Pressable>
    </View>
  );
}