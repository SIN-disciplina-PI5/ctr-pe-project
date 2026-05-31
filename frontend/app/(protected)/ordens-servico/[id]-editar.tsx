import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { ChipsField } from "@/components/forms/chips-field";
import { ControlledInput } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { PRIORIDADE_OS_LABEL, TIPO_OS_LABEL } from "@/constants/status";
import {
  useOrdemServico,
  useUpdateOrdemServico,
} from "@/features/ordens-servico/ordens-servico.hooks";
import {
  updateOrdemServicoSchema,
  type UpdateOrdemServicoInput,
} from "@/features/ordens-servico/ordens-servico.schemas";
import type { PrioridadeOS, TipoOS } from "@/types/ordem-servico";

const PRIORIDADES: PrioridadeOS[] = ["BAIXA", "MEDIA", "ALTA", "CRITICA"];
const TIPOS: TipoOS[] = ["CORRETIVA", "PREVENTIVA", "INSPECAO", "OUTRA"];

export default function EditarOrdemServicoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: os, isLoading } = useOrdemServico(id);
  const updateMutation = useUpdateOrdemServico(id);

  const { control, handleSubmit } = useForm<UpdateOrdemServicoInput>({
    resolver: zodResolver(updateOrdemServicoSchema),
    values: {
      titulo: os?.titulo ?? "",
      descricao: os?.descricao ?? "",
      prioridade: os?.prioridade ?? "MEDIA",
      tipo: os?.tipo ?? "CORRETIVA",
      observacao: os?.observacao ?? "",
    },
  });

  function onSubmit(values: UpdateOrdemServicoInput) {
    updateMutation.mutate(values, { onSuccess: () => router.back() });
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 32, gap: 16 }}
    >
      <Text variant="h4">Editar Ordem de Serviço</Text>

      <ControlledInput control={control} name="titulo" label="Título" />
      <ControlledInput control={control} name="descricao" label="Descrição" multiline />
      <ChipsField
        control={control}
        name="prioridade"
        label="Prioridade"
        options={PRIORIDADES}
        labels={PRIORIDADE_OS_LABEL}
      />
      <ChipsField
        control={control}
        name="tipo"
        label="Tipo"
        options={TIPOS}
        labels={TIPO_OS_LABEL}
      />
      <ControlledInput control={control} name="observacao" label="Observação" multiline />

      {updateMutation.isError ? (
        <Text variant="small" className="text-destructive">
          Não foi possível salvar as alterações.
        </Text>
      ) : null}

      <Button onPress={handleSubmit(onSubmit)} disabled={updateMutation.isPending}>
        <Text>{updateMutation.isPending ? "Salvando…" : "Salvar"}</Text>
      </Button>
    </ScrollView>
  );
}
