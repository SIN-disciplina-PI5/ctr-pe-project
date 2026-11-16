import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { ChipsField } from "@/components/forms/chips-field";
import { ControlledInput } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { notify } from "@/store/toast-store";

import { useSolicitarRelatorio } from "./relatorios.hooks";
import { reportFormSchema, type ReportFormInput } from "./relatorios.schemas";
import type { ReportType } from "./relatorios.types";
import {
  apiErrorMessage,
  buildCreateReportInput,
  newIdempotencyKey,
  PERIOD_PRESET_LABEL,
  REPORT_TYPE_LABEL,
  type PeriodPreset,
} from "./relatorios.utils";

const TIPOS: Array<ReportType | "custom"> = [
  "monthly_maintenance",
  "asset_costs",
  "availability",
  "custom",
];
const TIPO_LABELS: Record<ReportType | "custom", string> = {
  ...REPORT_TYPE_LABEL,
  custom: "Personalizado",
};
const PERIODOS: PeriodPreset[] = [
  "last_month",
  "current_month",
  "last_90_days",
  "none",
  "custom",
];

const DEFAULT_VALUES: ReportFormInput = {
  tipo: "monthly_maintenance",
  periodo: "last_month",
  inicio: "",
  fim: "",
  pedido: "",
};

export function RelatorioForm() {
  const solicitar = useSolicitarRelatorio();
  // Repetir o mesmo pedido (ex.: após erro de rede) reaproveita a chave, e o
  // backend devolve o mesmo job em vez de criar outro.
  const lastAttempt = useRef<{ payload: string; key: string } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReportFormInput>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const tipo = watch("tipo");
  const periodo = watch("periodo");

  function onSubmit(values: ReportFormInput) {
    const input = buildCreateReportInput(values);
    const payload = JSON.stringify(input);
    if (lastAttempt.current?.payload !== payload) {
      lastAttempt.current = { payload, key: newIdempotencyKey() };
    }

    solicitar.mutate(
      { input, idempotencyKey: lastAttempt.current.key },
      {
        onSuccess: () => {
          lastAttempt.current = null;
          reset(DEFAULT_VALUES);
          notify.success(
            "Relatório solicitado",
            "Acompanhe o andamento na lista abaixo.",
          );
        },
        onError: (error) => {
          notify.error(
            "Erro ao solicitar relatório",
            apiErrorMessage(error, "Não foi possível solicitar o relatório."),
          );
        },
      },
    );
  }

  return (
    <Card className="gap-4 py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-base">Novo relatório</CardTitle>
        <Text className="text-sm text-muted-foreground">
          O relatório é gerado em segundo plano com os dados da sua empresa. Você
          pode sair desta tela e voltar depois.
        </Text>
      </CardHeader>

      <CardContent className="gap-4 px-4">
        <ChipsField
          control={control}
          name="tipo"
          label="Tipo de relatório"
          options={TIPOS}
          labels={TIPO_LABELS}
        />

        <ChipsField
          control={control}
          name="periodo"
          label="Período"
          options={PERIODOS}
          labels={PERIOD_PRESET_LABEL}
        />

        {periodo === "custom" ? (
          <View className="flex-row flex-wrap gap-3">
            <View className="min-w-[160px] flex-1">
              <ControlledInput
                control={control}
                name="inicio"
                label="Data inicial"
                placeholder="dd/mm/aaaa"
                error={errors.inicio?.message}
              />
            </View>
            <View className="min-w-[160px] flex-1">
              <ControlledInput
                control={control}
                name="fim"
                label="Data final"
                placeholder="dd/mm/aaaa"
                error={errors.fim?.message}
              />
            </View>
          </View>
        ) : null}

        <ControlledInput
          control={control}
          name="pedido"
          label={tipo === "custom" ? "Descreva o relatório *" : "Detalhes (opcional)"}
          placeholder={
            tipo === "custom"
              ? "Ex.: ordens de serviço atrasadas por ativo crítico"
              : "Ex.: destaque os ativos com mais paradas"
          }
          multiline
          error={errors.pedido?.message}
        />

        <View className="items-end">
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={solicitar.isPending}
            accessibilityLabel="Solicitar relatório"
          >
            <Text>{solicitar.isPending ? "Solicitando..." : "Solicitar relatório"}</Text>
          </Button>
        </View>
      </CardContent>
    </Card>
  );
}
