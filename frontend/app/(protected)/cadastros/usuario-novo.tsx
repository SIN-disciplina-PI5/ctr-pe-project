import { View, Text, TextInput, Pressable, Switch, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUsuario } from "@/features/usuarios/usuarios.hooks";
import { useEmpresas } from "@/features/empresas/empresas.hooks";
import { useEmpresaStore } from "@/store/empresa-store";
import {
  createUsuarioSchema,
  type CreateUsuarioFormData,
  PERFIS,
} from "@/features/usuarios/usuarios.schemas";
import type { PerfilUsuario } from "@/features/usuarios/usuarios.types";

export default function UsuarioNovoScreen() {
  const router = useRouter();
  const { empresaId } = useEmpresaStore();
  const { data: empresas } = useEmpresas({ ativa: true });
  const { mutate: createUsuario, isPending } = useCreateUsuario();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUsuarioFormData>({
    resolver: zodResolver(createUsuarioSchema),
    defaultValues: {
      empresaId: empresaId ?? "",
      perfil: "TECNICO",
      ativo: true,
    },
  });

  function onSubmit(data: CreateUsuarioFormData) {
    createUsuario(data, {
      onSuccess: () => {
        Alert.alert("Sucesso", "Usuário criado com sucesso.");
        router.back();
      },
      onError: () => Alert.alert("Erro", "Não foi possível criar o usuário."),
    });
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-foreground text-xl font-bold mb-6">Novo usuário</Text>

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
            placeholder="Ex: João Silva"
            placeholderTextColor="#888"
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
            placeholder="Ex: joao@empresa.com"
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
            value={field.value}
            onChangeText={field.onChange}
            className="border border-border rounded-md px-3 py-2 mb-1 text-foreground bg-card"
          />
        )}
      />
      {errors.email && <Text className="text-destructive text-xs mb-3">{errors.email.message}</Text>}

      {/* Senha */}
      <Text className="text-foreground text-sm mb-1">Senha inicial *</Text>
      <Controller
        control={control}
        name="senha"
        render={({ field }) => (
          <TextInput
            secureTextEntry
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#888"
            value={field.value}
            onChangeText={field.onChange}
            className="border border-border rounded-md px-3 py-2 mb-1 text-foreground bg-card"
          />
        )}
      />
      {errors.senha && <Text className="text-destructive text-xs mb-3">{errors.senha.message}</Text>}

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