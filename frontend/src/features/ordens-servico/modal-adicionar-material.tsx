import { Modal, View, Text, Pressable, TextInput, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddMaterialOS } from "./os-materiais.hooks";

const schema = z.object({
  materialId: z.string().min(1, "Material é obrigatório"),
  quantidade: z.number().min(0.01, "Quantidade inválida"),
  custoUnitario: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

type ModalAdicionarMaterialProps = {
  ordemServicoId: string | null;
  onClose: () => void;
};

export function ModalAdicionarMaterial({ ordemServicoId, onClose }: ModalAdicionarMaterialProps) {
  const { mutate: addMaterial, isPending } = useAddMaterialOS(ordemServicoId ?? "");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { quantidade: 1 },
  });

  function onSubmit(data: FormData) {
    if (!ordemServicoId) return;
    addMaterial(
      {
        materialId: data.materialId,
        quantidade: data.quantidade,
        custoUnitario: data.custoUnitario,
      },
      {
        onSuccess: () => {
          Alert.alert("Sucesso", "Material adicionado.");
          reset();
          onClose();
        },
        onError: () => Alert.alert("Erro", "Não foi possível adicionar o material."),
      }
    );
  }

  return (
    <Modal visible={!!ordemServicoId} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center p-4">
        <View className="bg-card rounded-xl p-6 w-full max-w-sm">
          <Text className="text-foreground text-lg font-bold mb-4">Adicionar material</Text>

          <Text className="text-foreground text-sm mb-1">ID do Material *</Text>
          <Controller
            control={control}
            name="materialId"
            render={({ field }) => (
              <TextInput
                placeholder="ID do material"
                placeholderTextColor="#888"
                value={field.value}
                onChangeText={field.onChange}
                className="border border-border rounded-md px-3 py-2 mb-1 text-foreground bg-background"
              />
            )}
          />
          {errors.materialId && (
            <Text className="text-destructive text-xs mb-3">{errors.materialId.message}</Text>
          )}

          <Text className="text-foreground text-sm mb-1">Quantidade *</Text>
          <Controller
            control={control}
            name="quantidade"
            render={({ field }) => (
              <TextInput
                placeholder="Ex: 2"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={String(field.value)}
                onChangeText={field.onChange}
                className="border border-border rounded-md px-3 py-2 mb-1 text-foreground bg-background"
              />
            )}
          />
          {errors.quantidade && (
            <Text className="text-destructive text-xs mb-3">{errors.quantidade.message}</Text>
          )}

          <Text className="text-foreground text-sm mb-1">Custo unitário (opcional)</Text>
          <Controller
            control={control}
            name="custoUnitario"
            render={({ field }) => (
              <TextInput
                placeholder="Ex: 35.50"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={field.value ? String(field.value) : ""}
                onChangeText={field.onChange}
                className="border border-border rounded-md px-3 py-2 mb-4 text-foreground bg-background"
              />
            )}
          />

          <View className="flex-row gap-3">
            <Pressable
              onPress={() => { reset(); onClose(); }}
              className="flex-1 border border-border py-2 rounded-md items-center"
            >
              <Text className="text-foreground text-sm">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
              className="flex-1 bg-primary py-2 rounded-md items-center"
            >
              <Text className="text-primary-foreground text-sm font-semibold">
                {isPending ? "Adicionando..." : "Adicionar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}