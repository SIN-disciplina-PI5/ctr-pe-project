import { Modal, View, Text, Pressable, TextInput, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cancelarParadaSchema, type CancelarParadaFormData } from "./paradas.schemas";
import { useCancelarParada } from "./paradas.hooks";

type ModalCancelarParadaProps = {
  paradaId: string | null;
  onClose: () => void;
};

export function ModalCancelarParada({ paradaId, onClose }: ModalCancelarParadaProps) {
  const { mutate: cancelar, isPending } = useCancelarParada();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelarParadaFormData>({
    resolver: zodResolver(cancelarParadaSchema),
  });

  function onSubmit(data: CancelarParadaFormData) {
    if (!paradaId) return;
    cancelar(
      { id: paradaId, dto: { motivo: data.motivo } },
      {
        onSuccess: () => {
          Alert.alert("Sucesso", "Parada cancelada.");
          reset();
          onClose();
        },
        onError: () => Alert.alert("Erro", "Não foi possível cancelar a parada."),
      }
    );
  }

  return (
    <Modal visible={!!paradaId} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center p-4">
        <View className="bg-card rounded-xl p-6 w-full max-w-sm">
          <Text className="text-foreground text-lg font-bold mb-4">Cancelar parada</Text>

          <Text className="text-foreground text-sm mb-1">Motivo *</Text>
          <Controller
            control={control}
            name="motivo"
            render={({ field }) => (
              <TextInput
                placeholder="Ex: Parada registrada por engano"
                placeholderTextColor="#888"
                value={field.value}
                onChangeText={field.onChange}
                multiline
                numberOfLines={3}
                className="border border-border rounded-md px-3 py-2 mb-1 text-foreground bg-background"
              />
            )}
          />
          {errors.motivo && (
            <Text className="text-destructive text-xs mb-3">{errors.motivo.message}</Text>
          )}

          <View className="flex-row gap-3 mt-2">
            <Pressable
              onPress={() => { reset(); onClose(); }}
              className="flex-1 border border-border py-2 rounded-md items-center"
            >
              <Text className="text-foreground text-sm">Voltar</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
              className="flex-1 bg-destructive py-2 rounded-md items-center"
            >
              <Text className="text-white text-sm font-semibold">
                {isPending ? "Cancelando..." : "Confirmar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}