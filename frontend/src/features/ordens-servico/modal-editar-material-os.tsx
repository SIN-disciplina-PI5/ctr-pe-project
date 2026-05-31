import { useEffect } from "react";
import { Modal, View, Text, Pressable, TextInput, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateMaterialOS } from "./os-materiais.hooks";
import type { OrdemServicoMaterial } from "./os-materiais.types";

const schema = z.object({
  quantidade: z.number().min(0.01, "Quantidade inválida"),
  custoUnitario: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

type ModalEditarMaterialOSProps = {
  item: OrdemServicoMaterial | null;
  ordemServicoId: string;
  onClose: () => void;
};

export function ModalEditarMaterialOS({ item, ordemServicoId, onClose }: ModalEditarMaterialOSProps) {
  const { mutate: updateMaterial, isPending } = useUpdateMaterialOS(ordemServicoId);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (item) {
      reset({
        quantidade: Number(item.quantidade),
        custoUnitario: Number(item.custoUnitario),
      });
    }
  }, [item]);

  function onSubmit(data: FormData) {
    if (!item) return;
    updateMaterial(
      { id: item.id, dto: data },
      {
        onSuccess: () => {
          Alert.alert("Sucesso", "Material atualizado.");
          onClose();
        },
        onError: () => Alert.alert("Erro", "Não foi possível atualizar o material."),
      }
    );
  }

  return (
    <Modal visible={!!item} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center p-4">
        <View className="bg-card rounded-xl p-6 w-full max-w-sm">
          <Text className="text-foreground text-lg font-bold mb-1">Editar material</Text>
          {item?.material?.nome && (
            <Text className="text-muted-foreground text-sm mb-4">{item.material.nome}</Text>
          )}

          <Text className="text-foreground text-sm mb-1">Quantidade *</Text>
          <Controller
            control={control}
            name="quantidade"
            render={({ field }) => (
              <TextInput
                keyboardType="numeric"
                value={String(field.value ?? "")}
                onChangeText={(v) => field.onChange(Number(v))}
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
                keyboardType="numeric"
                value={field.value ? String(field.value) : ""}
                onChangeText={(v) => field.onChange(v ? Number(v) : undefined)}
                className="border border-border rounded-md px-3 py-2 mb-4 text-foreground bg-background"
              />
            )}
          />

          <View className="flex-row gap-3">
            <Pressable
              onPress={onClose}
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
                {isPending ? "Salvando..." : "Salvar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}