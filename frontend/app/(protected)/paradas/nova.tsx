import { View, Text, TextInput, Pressable, Switch, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createParadaSchema, type CreateParadaFormData } from "@/features/paradas/paradas.schemas";
import { useCreateParada } from "@/features/paradas/paradas.hooks";
import { useEmpresas } from "@/features/empresas/empresas.hooks";
import { useEmpresaStore } from "@/store/empresa-store";

export default function ParadaNovaScreen() {
  const router = useRouter();
  const { empresaId } = useEmpresaStore();
  const { data: empresas } = useEmpresas({ ativa: true });
  const { mutate: createParada, isPending } = useCreateParada();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateParadaFormData>({
    resolver: zodResolver(createParadaSchema),
    defaultValues: {
      empresaId: empresaId ?? "",
      inicioEm: new Date().toISOString(),
      programada: false,
      impactaDisponibilidade: true,
    },
  });

  function onSubmit(data: CreateParadaFormData) {
    createParada(data, {
      onSuccess: () => {
        Alert.alert("Sucesso", "Parada registrada.");
        router.back();
      },
      onError: () => Alert.alert("Erro", "Não foi possível registrar a parada."),
    });
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-foreground text-xl font-bold mb-6">Nova parada manual</Text>

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
                  <Text
                    className={
                      field.value === e.id
                        ? "text-primary-foreground text-sm"
                        : "text-foreground text-sm"
                    }
                  >
                    {e.nome}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        />
        {errors.empresaId && (
          <Text className="text-destructive text-xs mb-3">{errors.empresaId.message}</Text>
        )}

        {/* Ativo ID */}
        <Text className="text-foreground text-sm mb-1 mt-2">ID do Ativo *</Text>
        <Controller
          control={control}
          name="ativoId"
          render={({ field }) => (
            <TextInput
              placeholder="ID do ativo"
              placeholderTextColor="#888"
              value={field.value}
              onChangeText={field.onChange}
              className="border border-border rounded-md px-3 py-2 mb-1 text-foreground bg-card"
            />
          )}
        />
        {errors.ativoId && (
          <Text className="text-destructive text-xs mb-3">{errors.ativoId.message}</Text>
        )}

        {/* OS opcional */}
        <Text className="text-foreground text-sm mb-1">ID da O.S. (opcional)</Text>
        <Controller
          control={control}
          name="ordemServicoId"
          render={({ field }) => (
            <TextInput
              placeholder="ID da ordem de serviço"
              placeholderTextColor="#888"
              value={field.value}
              onChangeText={field.onChange}
              className="border border-border rounded-md px-3 py-2 mb-4 text-foreground bg-card"
            />
          )}
        />

        {/* Início */}
        <Text className="text-foreground text-sm mb-1">Início *</Text>
        <Controller
          control={control}
          name="inicioEm"
          render={({ field }) => (
            <TextInput
              placeholder="Ex: 2026-05-01T10:00:00.000Z"
              placeholderTextColor="#888"
              value={field.value}
              onChangeText={field.onChange}
              className="border border-border rounded-md px-3 py-2 mb-1 text-foreground bg-card"
            />
          )}
        />
        {errors.inicioEm && (
          <Text className="text-destructive text-xs mb-3">{errors.inicioEm.message}</Text>
        )}

        {/* Motivo */}
        <Text className="text-foreground text-sm mb-1">Motivo</Text>
        <Controller
          control={control}
          name="motivo"
          render={({ field }) => (
            <TextInput
              placeholder="Ex: Parada para manutenção preventiva"
              placeholderTextColor="#888"
              value={field.value}
              onChangeText={field.onChange}
              multiline
              numberOfLines={3}
              className="border border-border rounded-md px-3 py-2 mb-4 text-foreground bg-card"
            />
          )}
        />

        {/* Programada */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-foreground text-sm">Programada</Text>
          <Controller
            control={control}
            name="programada"
            render={({ field }) => (
              <Switch value={field.value} onValueChange={field.onChange} />
            )}
          />
        </View>

        {/* Impacta disponibilidade */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-foreground text-sm">Impacta disponibilidade</Text>
          <Controller
            control={control}
            name="impactaDisponibilidade"
            render={({ field }) => (
              <Switch value={field.value} onValueChange={field.onChange} />
            )}
          />
        </View>

        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          className="bg-primary py-3 rounded-md items-center"
        >
          <Text className="text-primary-foreground font-semibold">
            {isPending ? "Salvando..." : "Registrar parada"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}