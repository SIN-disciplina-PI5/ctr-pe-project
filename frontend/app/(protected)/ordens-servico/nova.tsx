import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, View } from "react-native";

import { ChipsField } from "@/components/forms/chips-field";
import { ControlledInput } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { PRIORIDADE_OS_LABEL, TIPO_OS_LABEL } from "@/constants/status";
import { useAtivos } from "@/features/ativos/ativos.hooks";
import { useCreateOrdemServico } from "@/features/ordens-servico/ordens-servico.hooks";
import {
  createOrdemServicoSchema,
  type CreateOrdemServicoInput,
} from "@/features/ordens-servico/ordens-servico.schemas";
import { useSelectedEmpresaId } from "@/hooks/use-selected-empresa";
import type { PrioridadeOS, TipoOS } from "@/types/ordem-servico";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PRIORIDADES: PrioridadeOS[] = ["BAIXA", "MEDIA", "ALTA", "CRITICA"];
const TIPOS: TipoOS[] = ["CORRETIVA", "PREVENTIVA", "INSPECAO", "OUTRA"];

export default function NovaOrdemServicoScreen() {
  const router = useRouter();
  const empresaId = useSelectedEmpresaId();
  const createMutation = useCreateOrdemServico();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
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

  const ativoId = watch("ativoId");

  const { data: ativos, isLoading: loadingAtivos } = useAtivos({
    empresaId: empresaId ?? undefined,
  });

  function onSubmit(values: CreateOrdemServicoInput) {
    createMutation.mutate(values, {
      onSuccess: (os) => router.replace(`/ordens-servico/${os.id}`),
    });
  }

  return (
    <ScrollView
      className="flex-1 bg-background px-4 py-6"
      contentContainerStyle={{ paddingBottom: 32, gap: 16 }}
    >
      <Text variant="h4">Nova Ordem de Serviço</Text>

      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">Ativo *</Text>

        {!empresaId ? (
          <Text className="text-sm text-muted-foreground">
            Selecione uma empresa no topo antes de criar a O.S.
          </Text>
        ) : loadingAtivos ? (
          <Text className="text-sm text-muted-foreground">Carregando ativos...</Text>
        ) : (
          <>
            <Select
              value={{
                value: ativoId,
                label:
                  ativos?.find((ativo) => ativo.id === ativoId)
                    ? `${ativos.find((ativo) => ativo.id === ativoId)?.codigo} - ${ativos.find((ativo) => ativo.id === ativoId)?.nome}`
                    : "Selecione um ativo",
              }}
              onValueChange={(option) =>
                setValue("ativoId", String(option?.value ?? ""), { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue
                  className="text-foreground"
                  placeholder="Selecione um ativo"
                />
              </SelectTrigger>
              <SelectContent>
                {ativos?.map((ativo) => (
                  <SelectItem
                    key={ativo.id}
                    label={`${ativo.codigo} - ${ativo.nome}`}
                    value={ativo.id}
                  >
                    {ativo.codigo} - {ativo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(!ativos || ativos.length === 0) && (
              <Text className="text-sm text-muted-foreground">
                Nenhum ativo encontrado para a empresa selecionada.
              </Text>
            )}
          </>
        )}

        {errors.ativoId?.message ? (
          <Text className="text-sm text-destructive">{errors.ativoId.message}</Text>
        ) : null}
      </View>

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

      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={createMutation.isPending || !empresaId}
      >
        <Text>{createMutation.isPending ? "Salvando..." : "Criar O.S."}</Text>
      </Button>
    </ScrollView>
  );
}