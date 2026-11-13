import { useMemo } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { Boxes, ClipboardList } from "lucide-react-native";

import type { BarDatum } from "@/components/charts/bar-chart";
import { BotaoAtualizar } from "@/components/charts/botao-atualizar";
import { ChartCard } from "@/components/charts/chart-card";
import { ChartSkeleton } from "@/components/charts/chart-skeleton";
import { ColumnChart } from "@/components/charts/column-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { StatCard } from "@/components/charts/stat-card";
import { Text } from "@/components/ui/text";
import {
  useDashboardAtivos,
  useDashboardOrdensServico,
} from "@/features/dashboard/dashboard.hooks";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
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

  function atualizar() {
    ativos.refetch();
    ordens.refetch();
  }

  useAutoRefresh(atualizar);

  const isLoading = ativos.isLoading || ordens.isLoading;
  const isError = ativos.isError || ordens.isError;
  const atualizando = ativos.isRefetching || ordens.isRefetching;
  const ultima = Math.max(ativos.dataUpdatedAt ?? 0, ordens.dataUpdatedAt ?? 0);
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
          Não foi possível buscar os indicadores.
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
      refreshControl={
        <RefreshControl refreshing={atualizando} onRefresh={atualizar} />
      }
    >
      <View className="mx-auto w-full max-w-5xl gap-4">
        <View className="flex-row flex-wrap items-start justify-between gap-3">
          <View className="gap-1">
            <Text className="text-2xl font-bold text-foreground">Indicadores</Text>
            <Text className="text-sm text-muted-foreground">
              Distribuição de ativos e ordens de serviço.
            </Text>
          </View>
          <BotaoAtualizar
            onPress={atualizar}
            carregando={atualizando}
            atualizadoEm={atualizadoEm}
          />
        </View>

        <View className="flex-row flex-wrap gap-3">
          <StatCard label="Ativos cadastrados" value={totalAtivos} icon={Boxes} />
          <StatCard label="Ordens de serviço" value={totalOs} icon={ClipboardList} />
        </View>

        <View className="flex-row flex-wrap gap-4">
          <View className="min-w-[300px] flex-1">
            <ChartCard title="Ativos por status" subtitle="Situação atual dos ativos">
              <DonutChart data={porStatus} centerValue={totalAtivos} centerLabel="ativos" />
            </ChartCard>
          </View>

          <View className="min-w-[300px] flex-1">
            <ChartCard title="O.S. por tipo" subtitle="Tipos de manutenção">
              <DonutChart data={porTipo} centerValue={totalOs} centerLabel="ordens" />
            </ChartCard>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-4">
          <View className="min-w-[300px] flex-1">
            <ChartCard title="Ativos por criticidade">
              <ColumnChart data={porCriticidade} />
            </ChartCard>
          </View>

          <View className="min-w-[300px] flex-1">
            <ChartCard title="O.S. por prioridade">
              <ColumnChart data={porPrioridade} />
            </ChartCard>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}