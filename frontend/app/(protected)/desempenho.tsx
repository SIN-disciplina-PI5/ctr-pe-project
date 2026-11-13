import { useMemo } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { Clock, Package, Timer, Wallet } from "lucide-react-native";

import type { BarDatum } from "@/components/charts/bar-chart";
import { BotaoAtualizar } from "@/components/charts/botao-atualizar";
import { ChartCard } from "@/components/charts/chart-card";
import { ChartSkeleton } from "@/components/charts/chart-skeleton";
import { DonutChart } from "@/components/charts/donut-chart";
import { StatCard } from "@/components/charts/stat-card";
import { PermissionRoute } from "@/components/domain/permission-gate";
import { Text } from "@/components/ui/text";
import {
  useDashboardCustos,
  useDashboardMateriais,
  useDashboardResumo,
} from "@/features/dashboard/dashboard.hooks";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import { useSelectedEmpresaId } from "@/hooks/use-selected-empresa";
import { formatBRL, formatMinutos } from "@/lib/formatters";

function DesempenhoContent() {
  const empresaId = useSelectedEmpresaId();
  const params = useMemo(
    () => ({ empresaId: empresaId ?? undefined }),
    [empresaId],
  );

  const resumo = useDashboardResumo(params);
  const custos = useDashboardCustos(params);
  const materiais = useDashboardMateriais(params);

  function atualizar() {
    resumo.refetch();
    custos.refetch();
    materiais.refetch();
  }

  useAutoRefresh(atualizar);

  const isLoading = resumo.isLoading || custos.isLoading || materiais.isLoading;
  const isError = resumo.isError || custos.isError || materiais.isError;
  const atualizando =
    resumo.isRefetching || custos.isRefetching || materiais.isRefetching;
  const ultima = Math.max(
    resumo.dataUpdatedAt ?? 0,
    custos.dataUpdatedAt ?? 0,
    materiais.dataUpdatedAt ?? 0,
  );
  const atualizadoEm = ultima > 0 ? new Date(ultima) : null;

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ChartSkeleton />
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
        <Pressable
          onPress={atualizar}
          className="mt-4 h-10 items-center justify-center rounded-md bg-primary px-5"
        >
          <Text className="font-medium text-primary-foreground">
            Tentar novamente
          </Text>
        </Pressable>
      </View>
    );
  }

  const indicadores = resumo.data?.indicadores;
  const materiaisCriticos = materiais.data?.materiaisCriticos ?? [];
  const osAtrasadas = indicadores?.osAtrasadas ?? 0;

  const custosData: BarDatum[] = [
    { label: "Materiais", value: custos.data?.custoMateriais ?? 0 },
    { label: "Mão de obra", value: custos.data?.custoMaoObra ?? 0 },
  ];

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 px-4 py-6"
      refreshControl={
        <RefreshControl refreshing={atualizando} onRefresh={atualizar} />
      }
    >
      <View className="mx-auto w-full max-w-5xl gap-4">
        <View className="flex-row flex-wrap items-start justify-between gap-3">
          <View className="gap-1">
            <Text className="text-2xl font-bold text-foreground">
              Desempenho e custos
            </Text>
            <Text className="text-sm text-muted-foreground">
              Visão financeira e de disponibilidade da operação.
            </Text>
          </View>
          <BotaoAtualizar
            onPress={atualizar}
            carregando={atualizando}
            atualizadoEm={atualizadoEm}
          />
        </View>

        <View className="flex-row flex-wrap gap-3">
          <StatCard
            label="Custo total"
            value={formatBRL(indicadores?.custoTotal ?? 0)}
            icon={Wallet}
          />
          <StatCard
            label="O.S. atrasadas"
            value={osAtrasadas}
            icon={Clock}
            alerta={osAtrasadas > 0}
          />
          <StatCard
            label="Tempo médio parado"
            value={formatMinutos(indicadores?.tempoMedioParadoMinutos ?? 0)}
            icon={Timer}
          />
          <StatCard
            label="Materiais críticos"
            value={materiaisCriticos.length}
            icon={Package}
            alerta={materiaisCriticos.length > 0}
          />
        </View>

        <ChartCard title="Composição de custos" subtitle="Materiais x mão de obra">
          <DonutChart
            data={custosData}
            formatValue={formatBRL}
            centerValue={formatBRL(custos.data?.custoTotal ?? 0)}
            centerLabel="custo total"
          />
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

export default function DesempenhoScreen() {
  return (
    <PermissionRoute permission="costsRead">
      <DesempenhoContent />
    </PermissionRoute>
  );
}
