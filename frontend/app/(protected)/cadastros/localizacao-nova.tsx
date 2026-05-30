import { View, Text, TextInput, Pressable, Switch, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLocalizacao } from "@/features/localizacoes/localizacoes.hooks";
import { useEmpresas } from "@/features/empresas/empresas.hooks";
import { useEmpresaStore } from "@/store/empresa-store";

const schema = z.object({
  empresaId: z.string().min(1, "Empresa é obrigatória"),
  codigo: z.string().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.string().optional(),
  ativa: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function LocalizacaoNovaScreen() {
  const router = useRouter();
  const { empresaId } = useEmpresaStore();
  const { data: empresas } = useEmpresas({ ativa: true });
  const { mutate: createLocalizacao, isPending } = useCreateLocalizacao();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { empresaId: empresaId ?? "", ativa: true },
  });

  function onSubmit(data: FormData) {
    createLocalizacao(data, {
      onSuccess: () => {
        Alert.alert("Sucesso", "Localização criada com sucesso.");
        router.back();
      },
      onError: () => Alert.alert("Erro", "Não foi possível criar a localização."),
    });
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-foreground text-xl font-bold mb-6">Nova localização</Text>

      <Text className="text-foreground text-sm mb-1">Empresa *</Text>
      <Controller
        control={control}
        name="empresaId"
        render={({ field }) => (
          <View className="flex-row flex-wrap gap-2 mb-4">
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
                    field.value === e.id ? "text-primary-foreground text-sm" : "text-foreground text-sm"
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

      <Text className="text-foreground text-sm mb-1">Código</Text>
      <Controller
        control={control}
        name="codigo"
        render={({ field }) => (
          <TextInput
            placeholder="Ex: OFICINA"
            placeholderTextColor="#888"
            value={field.value}
            onChangeText={field.onChange}
            className="border border-border rounded-md px-3 py-2 mb-4 text-foreground bg-card"
          />
        )}
      />

      <Text className="text-foreground text-sm mb-1">Nome *</Text>
      <Controller
        control={control}
        name="nome"
        render={({ field }) => (
          <TextInput
            placeholder="Ex: Oficina"
            placeholderTextColor="#888"
            value={field.value}
            onChangeText={field.onChange}
            className="border border-border rounded-md px-3 py-2 mb-1 text-foreground bg-card"
          />
        )}
      />
      {errors.nome && (
        <Text className="text-destructive text-xs mb-3">{errors.nome.message}</Text>
      )}

      <Text className="text-foreground text-sm mb-1">Tipo</Text>
      <Controller
        control={control}
        name="tipo"
        render={({ field }) => (
          <TextInput
            placeholder="Ex: SETOR, AREA, GALPAO"
            placeholderTextColor="#888"
            value={field.value}
            onChangeText={field.onChange}
            className="border border-border rounded-md px-3 py-2 mb-4 text-foreground bg-card"
          />
        )}
      />

      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-foreground text-sm">Ativa</Text>
        <Controller
          control={control}
          name="ativa"
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
          {isPending ? "Salvando..." : "Salvar"}
        </Text>
      </Pressable>
    </View>
  );
}