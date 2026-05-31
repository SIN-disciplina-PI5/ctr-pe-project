import { Modal, View, Text, Pressable, TextInput, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { encerrarParadaSchema, type EncerrarParadaFormData } from "./paradas.schemas";
import { useEncerrarParada } from "./paradas.hooks";

type ModalEncerrarParadaProps = {
  paradaId: string | null;
  onClose: () => void;
};

export function ModalEncerrarParada({ paradaId, onClose }: ModalEncerrarParadaProps) {
  const { mutate: encerrar, isPending } = useEncerrarParada();

  const { control, handleSubmit, reset } = useForm<EncerrarParadaFormData>({
    resolver: zodResolver(encerrarParadaSchema),
    defaultValues: { fimEm: "" },
  });

  function onSubmit(data: EncerrarParadaFormData) {
    if (!paradaId) return;
    encerrar(
      { id: paradaId, dto: { fimEm: data.fimEm || undefined } },
      {
        onSuccess: () => {
          Alert.alert("Sucesso", "Parada encerrada.");
          reset();
          onClose();
        },
        onError: () => Alert.alert("Erro", "Não foi possível encerrar a parada."),
      }
    );
  }

  return (
    <Modal visible={!!paradaId} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center p-4">
        <View className="bg-card rounded-xl p-6 w-full max-w-sm">
          <Text className="text-foreground text-lg font-bold mb-2">Encerrar parada</Text>
          <Text className="text-muted-foreground text-sm mb-4">
            Deixe o campo em branco para usar o horário atual.
          </Text>

          <Text className="text-foreground text-sm mb-1">Data/hora de fim (opcional)</Text>
          <Controller
            control={control}
            name="fimEm"
            render={({ field }) => (
              <TextInput
                placeholder="Ex: 2026-05-01T15:00:00.000Z"
                placeholderTextColor="#888"
                value={field.value}
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
                {isPending ? "Encerrando..." : "Encerrar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}