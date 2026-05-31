import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function Chips<T extends string>({
  options,
  labels,
  value,
  onChange,
}: {
  options: T[];
  labels: Record<T, string>;
  value?: T;
  onChange: (value: T) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onChange(option)}
          className={
            value === option
              ? "rounded-full bg-primary px-3 py-1"
              : "rounded-full border border-border bg-background px-3 py-1"
          }
        >
          <Text
            variant="small"
            className={value === option ? "text-primary-foreground" : "text-foreground"}
          >
            {labels[option]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

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
    updateMutation.mutate(values, {
      onSuccess: () => {
        router.back();
      },
    });
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

      <View className="gap-2">
        <Text variant="small">Título</Text>
        <Controller
          control={control}
          name="titulo"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </View>

      <View className="gap-2">
        <Text variant="small">Descrição</Text>
        <Controller
          control={control}
          name="descricao"
          render={({ field }) => (
            <Input
              multiline
              className="h-24"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </View>

      <View className="gap-2">
        <Text variant="small">Prioridade</Text>
        <Controller
          control={control}
          name="prioridade"
          render={({ field }) => (
            <Chips
              options={PRIORIDADES}
              labels={PRIORIDADE_OS_LABEL}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </View>

      <View className="gap-2">
        <Text variant="small">Tipo</Text>
        <Controller
          control={control}
          name="tipo"
          render={({ field }) => (
            <Chips
              options={TIPOS}
              labels={TIPO_OS_LABEL}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </View>

      <View className="gap-2">
        <Text variant="small">Observação</Text>
        <Controller
          control={control}
          name="observacao"
          render={({ field }) => (
            <Input
              multiline
              className="h-20"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </View>

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
