import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";

import { ChipsField } from "@/components/forms/chips-field";
import { ControlledInput } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
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
      onSuccess: (os) => router.replace(`/ordens-servico/${os.id}`),
    });
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 32, gap: 16 }}
    >
      <Text variant="h4">Nova Ordem de Serviço</Text>

      <ControlledInput
        control={control}
        name="ativoId"
        label="Ativo (ID)"
        placeholder="ID do ativo"
        autoCapitalize="none"
        error={errors.ativoId?.message}
      />
      <ControlledInput
        control={control}
        name="titulo"
        label="Título"
        placeholder="Título da O.S."
        error={errors.titulo?.message}
      />
      <ControlledInput
        control={control}
        name="descricao"
        label="Descrição"
        placeholder="Descreva o problema/serviço"
        multiline
        error={errors.descricao?.message}
      />
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
