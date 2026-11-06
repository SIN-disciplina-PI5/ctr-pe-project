import { useMemo } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { BarChart, type BarDatum } from "@/components/charts/bar-chart";
import { ChartCard } from "@/components/charts/chart-card";
import { StatCard } from "@/components/charts/stat-card";
import { Text } from "@/components/ui/text";
import {
  useDashboardCustos,
  useDashboardMateriais,
  useDashboardResumo,
} from "@/features/dashboard/dashboard.hooks";
import { useSelectedEmpresaId } from "@/hooks/use-selected-empresa";
import { formatBRL, formatMinutos } from "@/lib/formatters";

export default function DesempenhoScreen() {
  const empresaId = useSelectedEmpresaId();
  const params = useMemo(
    () => ({ empresaId: empresaId ?? undefined }),
    [empresaId],
  );

  const resumo = useDashboardResumo(params);
  const custos = useDashboardCustos(params);
  const materiais = useDashboardMateriais(params);

  const isLoading = resumo.isLoading || custos.isLoading || materiais.isLoading;
  const isError = resumo.isError || custos.isError || materiais.isError;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <ActivityIndicator />
        <Text className="mt-3 text-muted-foreground">Carregando desempenho...</Text>
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
          Não foi possível buscar os dados de desempenho.
        </Text>
      </View>
    );
  }

  const indicadores = resumo.data?.indicadores;
  const materiaisCriticos = materiais.data?.materiaisCriticos ?? [];

  const custosData: BarDatum[] = [
    { label: "Materiais", value: custos.data?.custoMateriais ?? 0 },
    { label: "Mão de obra", value: custos.data?.custoMaoObra ?? 0 },
  ];

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 px-4 py-6"
    >
      <View className="mx-auto w-full max-w-5xl gap-4">
        <View className="gap-1">
          <Text className="text-2xl font-bold text-foreground">
            Desempenho e custos
          </Text>
          <Text className="text-sm text-muted-foreground">
            Visão financeira e de disponibilidade da operação.
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-3">
          <StatCard
            label="Custo total"
            value={formatBRL(indicadores?.custoTotal ?? 0)}
          />
          <StatCard label="O.S. atrasadas" value={indicadores?.osAtrasadas ?? 0} />
          <StatCard
            label="Tempo médio parado"
            value={formatMinutos(indicadores?.tempoMedioParadoMinutos ?? 0)}
          />
          <StatCard label="Materiais críticos" value={materiaisCriticos.length} />
        </View>

        <ChartCard
          title="Composição de custos"
          subtitle={`Total: ${formatBRL(custos.data?.custoTotal ?? 0)}`}
        >
          <BarChart data={custosData} formatValue={formatBRL} />
        </ChartCard>

        <ChartCard title="Materiais com estoque crítico">
          <View className="gap-3">
            {materiaisCriticos.length === 0 ? (
              <Text className="text-sm text-muted-foreground">
                Nenhum material com estoque baixo.
              </Text>
            ) : (
              materiaisCriticos.map((material) => (
                <View
                  key={material.id}
                  className="flex-row items-center justify-between rounded-md border border-border bg-background px-3 py-3"
                >
                  <View className="flex-1 pr-3">
                    <Text className="font-medium text-foreground">
                      {material.codigo} - {material.nome}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Estoque: {material.estoqueAtual} / Mínimo: {material.estoqueMinimo}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ChartCard>
      </View>
    </ScrollView>
  );
}