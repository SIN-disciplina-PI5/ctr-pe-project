import { useMemo } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { BarChart, type BarDatum } from "@/components/charts/bar-chart";
import { ChartCard } from "@/components/charts/chart-card";
import { StatCard } from "@/components/charts/stat-card";
import { Text } from "@/components/ui/text";
import {
  useDashboardAtivos,
  useDashboardOrdensServico,
} from "@/features/dashboard/dashboard.hooks";
import { useSelectedEmpresaId } from "@/hooks/use-selected-empresa";
import { formatRotulo } from "@/lib/formatters";

export default function IndicadoresScreen() {
  const empresaId = useSelectedEmpresaId();
  const params = useMemo(
    () => ({ empresaId: empresaId ?? undefined }),
    [empresaId],
  );

  const ativos = useDashboardAtivos(params);
  const ordens = useDashboardOrdensServico(params);

  const isLoading = ativos.isLoading || ordens.isLoading;
  const isError = ativos.isError || ordens.isError;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <ActivityIndicator />
        <Text className="mt-3 text-muted-foreground">Carregando indicadores...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-xl font-semibold text-foreground">
          Erro ao carregar
        </Text>
        <Text className="mt-2 text-center text-muted-foreground">
          Não foi possível buscar os indicadores.
        </Text>
      </View>
    );
  }

  const porStatus: BarDatum[] = (ativos.data?.ativosPorStatus ?? []).map((i) => ({
    label: formatRotulo(i.status),
    value: i.quantidade,
  }));
  const porCriticidade: BarDatum[] = (ativos.data?.ativosPorCriticidade ?? []).map(
    (i) => ({ label: formatRotulo(i.criticidade), value: i.quantidade }),
  );
  const porPrioridade: BarDatum[] = (ordens.data?.osPorPrioridade ?? []).map(
    (i) => ({ label: formatRotulo(i.prioridade), value: i.quantidade }),
  );
  const porTipo: BarDatum[] = (ordens.data?.osPorTipo ?? []).map((i) => ({
    label: formatRotulo(i.tipo),
    value: i.quantidade,
  }));

  const totalAtivos = porStatus.reduce((soma, i) => soma + i.value, 0);
  const totalOs = porPrioridade.reduce((soma, i) => soma + i.value, 0);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 px-4 py-6"
    >
      <View className="mx-auto w-full max-w-5xl gap-4">
        <View className="gap-1">
          <Text className="text-2xl font-bold text-foreground">Indicadores</Text>
          <Text className="text-sm text-muted-foreground">
            Distribuição de ativos e ordens de serviço.
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-3">
          <StatCard label="Ativos cadastrados" value={totalAtivos} />
          <StatCard label="Ordens de serviço" value={totalOs} />
        </View>

        <ChartCard title="Ativos por status">
          <BarChart data={porStatus} />
        </ChartCard>

        <ChartCard title="Ativos por criticidade">
          <BarChart data={porCriticidade} />
        </ChartCard>

        <ChartCard title="O.S. por prioridade">
          <BarChart data={porPrioridade} />
        </ChartCard>

        <ChartCard title="O.S. por tipo">
          <BarChart data={porTipo} />
        </ChartCard>
      </View>
    </ScrollView>
  );
}