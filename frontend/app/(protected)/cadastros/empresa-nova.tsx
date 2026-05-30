import { View, Text, TextInput, Pressable, Switch, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEmpresa } from "@/features/empresas/empresas.hooks";

const schema = z.object({
  codigo: z.string().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  ativa: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function EmpresaNovaScreen() {
  const router = useRouter();
  const { mutate: createEmpresa, isPending } = useCreateEmpresa();
const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { ativa: true },
  });

  function onSubmit(data: FormData) {
    createEmpresa(data, {
      onSuccess: () => {
        Alert.alert("Sucesso", "Empresa criada com sucesso.");
        router.back();
      },
      onError: () => Alert.alert("Erro", "Não foi possível criar a empresa."),
    });
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-foreground text-xl font-bold mb-6">Nova empresa</Text>

      <Text className="text-foreground text-sm mb-1">Código</Text>
      <Controller
        control={control}
        name="codigo"
        render={({ field }) => (
          <TextInput
            placeholder="Ex: MATRIZ"
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
            placeholder="Ex: CTR-PE Matriz"
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

      <View className="flex-row items-center justify-between mb-6 mt-2">
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