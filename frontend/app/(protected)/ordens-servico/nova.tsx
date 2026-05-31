import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { PRIORIDADE_OS_LABEL, TIPO_OS_LABEL } from "@/constants/status";
import { useCreateOrdemServico } from "@/features/ordens-servico/ordens-servico.hooks";
import {
  createOrdemServicoSchema,
  type CreateOrdemServicoInput,
} from "@/features/ordens-servico/ordens-servico.schemas";
import { useSelectedEmpresaId } from "@/hooks/use-selected-empresa";
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

export default function NovaOrdemServicoScreen() {
  const router = useRouter();
  const empresaId = useSelectedEmpresaId();
  const createMutation = useCreateOrdemServico();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrdemServicoInput>({
    resolver: zodResolver(createOrdemServicoSchema),
    defaultValues: {
      empresaId: empresaId ?? "",
      ativoId: "",
      titulo: "",
      descricao: "",
      prioridade: "MEDIA",
      tipo: "CORRETIVA",
    },
  });

  function onSubmit(values: CreateOrdemServicoInput) {
    createMutation.mutate(values, {
      onSuccess: (os) => {
        router.replace(`/ordens-servico/${os.id}`);
      },
    });
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 32, gap: 16 }}
    >
      <Text variant="h4">Nova Ordem de Serviço</Text>

      <View className="gap-2">
        <Text variant="small">Ativo (ID)</Text>
        <Controller
          control={control}
          name="ativoId"
          render={({ field }) => (
            <Input
              placeholder="ID do ativo"
              autoCapitalize="none"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.ativoId ? (
          <Text variant="small" className="text-destructive">
            {errors.ativoId.message}
          </Text>
        ) : null}
      </View>

      <View className="gap-2">
        <Text variant="small">Título</Text>
        <Controller
          control={control}
          name="titulo"
          render={({ field }) => (
            <Input
              placeholder="Título da O.S."
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.titulo ? (
          <Text variant="small" className="text-destructive">
            {errors.titulo.message}
          </Text>
        ) : null}
      </View>

      <View className="gap-2">
        <Text variant="small">Descrição</Text>
        <Controller
          control={control}
          name="descricao"
          render={({ field }) => (
            <Input
              placeholder="Descreva o problema/serviço"
              multiline
              className="h-24"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.descricao ? (
          <Text variant="small" className="text-destructive">
            {errors.descricao.message}
          </Text>
        ) : null}
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

      {createMutation.isError ? (
        <Text variant="small" className="text-destructive">
          Não foi possível criar a ordem de serviço.
        </Text>
      ) : null}

      <Button onPress={handleSubmit(onSubmit)} disabled={createMutation.isPending}>
        <Text>{createMutation.isPending ? "Salvando…" : "Criar O.S."}</Text>
      </Button>
    </ScrollView>
  );
}
