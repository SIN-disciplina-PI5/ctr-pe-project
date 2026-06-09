import { Modal, View, Text, Pressable, TextInput, Alert, ScrollView } from "react-native";
import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMateriais } from "@/features/materiais/materiais.hooks";
import { useAddMaterialOS } from "./os-materiais.hooks";

const schema = z.object({
  materialId: z.string().min(1, "Material é obrigatório"),
  quantidade: z.number().min(0.01, "Quantidade inválida"),
  custoUnitario: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

type ModalAdicionarMaterialProps = {
  ordemServicoId: string | null;
  empresaId: string;
  onClose: () => void;
};

export function ModalAdicionarMaterial({
  ordemServicoId,
  empresaId,
  onClose,
}: ModalAdicionarMaterialProps) {
  const { mutate: addMaterial, isPending } = useAddMaterialOS(ordemServicoId ?? "");
  const [search, setSearch] = useState("");

  const { data: materiais, isLoading } = useMateriais({
    empresaId,
    ativo: true,
    search: search || undefined,
  });

  const filtrados = useMemo(
    () => (materiais ?? []).slice(0, 12),
    [materiais],
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { materialId: "", quantidade: 1 },
  });

  const materialId = watch("materialId");

  function closeAndReset() {
    reset();
    setSearch("");
    onClose();
  }

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
          closeAndReset();
        },
        onError: () => Alert.alert("Erro", "Não foi possível adicionar o material."),
      },
    );
  }

  return (
    <Modal visible={!!ordemServicoId} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center p-4">
        <View className="bg-card rounded-xl p-6 w-full max-w-md max-h-[85%]">
          <Text className="text-foreground text-lg font-bold mb-4">Adicionar material</Text>

          <Text className="text-foreground text-sm mb-1">Buscar material</Text>
          <TextInput
            placeholder="Nome ou código"
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
            className="border border-border rounded-md px-3 py-2 mb-3 text-foreground bg-background"
          />

          <Text className="text-foreground text-sm mb-2">Selecione o material *</Text>
          <ScrollView className="max-h-48 mb-3">
            <View className="gap-2">
              {isLoading ? (
                <Text className="text-muted-foreground text-sm">Carregando materiais...</Text>
              ) : filtrados.length === 0 ? (
                <Text className="text-muted-foreground text-sm">
                  Nenhum material encontrado.
                </Text>
              ) : (
                filtrados.map((material) => (
                  <Pressable
                    key={material.id}
                    onPress={() => setValue("materialId", material.id)}
                    className={`rounded-md border px-3 py-2 ${
                      materialId === material.id
                        ? "border-primary bg-primary"
                        : "border-border bg-background"
                    }`}
                  >
                    <Text
                      className={
                        materialId === material.id
                          ? "text-primary-foreground font-medium"
                          : "text-foreground font-medium"
                      }
                    >
                      {material.codigo} - {material.nome}
                    </Text>
                    <Text
                      className={
                        materialId === material.id
                          ? "text-primary-foreground/80 text-xs"
                          : "text-muted-foreground text-xs"
                      }
                    >
                      Estoque: {material.estoqueAtual} | Mín.: {material.estoqueMinimo}
                    </Text>
                  </Pressable>
                ))
              )}
            </View>
          </ScrollView>
          {errors.materialId ? (
            <Text className="text-destructive text-xs mb-3">{errors.materialId.message}</Text>
          ) : null}

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
                onChangeText={(value) => field.onChange(Number(value || 0))}
                className="border border-border rounded-md px-3 py-2 mb-1 text-foreground bg-background"
              />
            )}
          />
          {errors.quantidade ? (
            <Text className="text-destructive text-xs mb-3">{errors.quantidade.message}</Text>
          ) : null}

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
                onChangeText={(value) => field.onChange(value ? Number(value) : undefined)}
                className="border border-border rounded-md px-3 py-2 mb-4 text-foreground bg-background"
              />
            )}
          />

          <View className="flex-row gap-3">
            <Pressable
              onPress={closeAndReset}
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