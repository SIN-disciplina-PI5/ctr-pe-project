import { router } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { Boxes, ClipboardList, CirclePause, PackageSearch } from "lucide-react-native";

import { ChartCard } from "@/components/charts/chart-card";
import { GaugeChart } from "@/components/charts/gauge-chart";
import { StatCard } from "@/components/charts/stat-card";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { useAlertas } from "@/features/alertas/alertas.hooks";
import { useAtivos } from "@/features/ativos/ativos.hooks";
import {
  useDashboardAtivos,
  useDashboardMateriais,
  useDashboardResumo,
} from "@/features/dashboard/dashboard.hooks";
import { useOrdensServico } from "@/features/ordens-servico/ordens-servico.hooks";
import { useSelectedEmpresaId } from "@/hooks/use-selected-empresa";

function ListaVazia({ texto }: { texto: string }) {
  return <Text className="text-sm text-muted-foreground">{texto}</Text>;
}

function LinhaItem({
  titulo,
  detalhe,
  badge,
  badgeVariant = "secondary",
  onPress,
}: {
  titulo: string;
  detalhe: string;
  badge: string;
  badgeVariant?: "secondary" | "destructive" | "default";
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-xl bg-muted/60 px-3.5 py-3 hover:bg-muted active:bg-muted"
    >
      <View className="flex-row items-center justify-between gap-3">
        <Text numberOfLines={1} className="flex-1 text-sm font-medium text-foreground">
          {titulo}
        </Text>
        <Badge variant={badgeVariant}>
          <Text>{badge}</Text>
        </Badge>
      </View>
      <Text numberOfLines={1} className="mt-0.5 text-xs text-muted-foreground">
        {detalhe}
      </Text>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const empresaId = useSelectedEmpresaId();

  const params = useMemo(
    () => ({
      empresaId: empresaId ?? undefined,
    }),
    [empresaId],
  );

  const resumo = useDashboardResumo(params);
  const dashboardAtivos = useDashboardAtivos(params);
  const dashboardMateriais = useDashboardMateriais(params);

  const ativosParados = useAtivos({
    empresaId: empresaId ?? undefined,
    status: "PARADO",
  });

  const ordensCriticas = useOrdensServico({
    empresaId: empresaId ?? undefined,
    prioridade: "CRITICA",
  });

  const alertasRecentes = useAlertas({
    empresaId: empresaId ?? undefined,
    status: "ABERTO",
  });

  const isLoading =
    resumo.isLoading ||
    dashboardAtivos.isLoading ||
    dashboardMateriais.isLoading ||
    ativosParados.isLoading ||
    ordensCriticas.isLoading ||
    alertasRecentes.isLoading;

  const isError =
    resumo.isError ||
    dashboardAtivos.isError ||
    dashboardMateriais.isError ||
    ativosParados.isError ||
    ordensCriticas.isError ||
    alertasRecentes.isError;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <ActivityIndicator />
        <Text className="mt-3 text-muted-foreground">Carregando dashboard...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-xl font-semibold">Erro ao carregar dashboard</Text>
        <Text className="mt-2 text-center text-muted-foreground">
          Não foi possível buscar os dados do dashboard.
        </Text>
      </View>
    );
  }

  const indicadores = resumo.data?.indicadores;
  const ativosTotais =
    dashboardAtivos.data?.ativosPorStatus.reduce(
      (acc, item) => acc + item.quantidade,
      0,
    ) ?? 0;

  const materiaisCriticos = dashboardMateriais.data?.materiaisCriticos ?? [];
  const listaAtivosParados = ativosParados.data?.slice(0, 5) ?? [];
  const listaOrdensCriticas = ordensCriticas.data?.slice(0, 5) ?? [];
  const listaAlertasRecentes = alertasRecentes.data?.slice(0, 5) ?? [];

  const emOperacao =
    ativosTotais > 0
      ? ((ativosTotais - (indicadores?.maquinasParadas ?? 0)) / ativosTotais) * 100
      : 0;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-5 p-5 md:p-8">
      <View className="gap-1">
        <Text className="text-3xl font-bold tracking-tight text-foreground">Dashboard</Text>
        <Text className="text-sm text-muted-foreground">
          Visão geral da operação de manutenção.
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-4">
        <View className="min-w-[46%] flex-1 md:min-w-[22%]">
          <StatCard label="Ativos totais" value={ativosTotais} icon={Boxes} />
        </View>
        <View className="min-w-[46%] flex-1 md:min-w-[22%]">
          <StatCard
            label="Máquinas paradas"
            value={indicadores?.maquinasParadas ?? 0}
            icon={CirclePause}
            alerta={(indicadores?.maquinasParadas ?? 0) > 0}
            onPress={() => router.push("/(protected)/(tabs)/ativos?status=PARADO")}
          />
        </View>
        <View className="min-w-[46%] flex-1 md:min-w-[22%]">
          <StatCard
            label="O.S. abertas"
            value={indicadores?.osAbertas ?? 0}
            icon={ClipboardList}
            onPress={() => router.push("/(protected)/(tabs)/ordens-servico?status=ABERTA")}
          />
        </View>
        <View className="min-w-[46%] flex-1 md:min-w-[22%]">
          <StatCard
            label="O.S. aguardando peça"
            value={indicadores?.osAguardandoPeca ?? 0}
            icon={PackageSearch}
            onPress={() =>
              router.push("/(protected)/(tabs)/ordens-servico?status=AGUARDANDO_PECA")
            }
          />
        </View>
      </View>

      <View className="flex-row flex-wrap gap-4">
        <View className="min-w-[300px] flex-1">
          <ChartCard title="Ativos em operação" subtitle="Percentual de ativos que não estão parados">
            <View className="items-center">
              <GaugeChart value={emOperacao} label="em operação" />
            </View>
          </ChartCard>
        </View>

        <View className="min-w-[300px] flex-[2]">
          <ChartCard title="Alertas recentes" subtitle="Alertas em aberto, do mais novo ao mais antigo">
            <View className="gap-2">
              {listaAlertasRecentes.length === 0 ? (
                <ListaVazia texto="Nenhum alerta recente." />
              ) : (
                listaAlertasRecentes.map((alerta) => (
                  <LinhaItem
                    key={alerta.id}
                    titulo={alerta.titulo}
                    detalhe={alerta.mensagem}
                    badge={alerta.severidade}
                    onPress={() => {
                      if (alerta.ordemServicoId) {
                        router.push(`/(protected)/ordens-servico/${alerta.ordemServicoId}`);
                        return;
                      }
                      if (alerta.ativoId) {
                        router.push(`/(protected)/ativos/${alerta.ativoId}`);
                      }
                    }}
                  />
                ))
              )}
            </View>
          </ChartCard>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-4">
        <View className="min-w-[300px] flex-1">
          <ChartCard title="Ativos parados">
            <View className="gap-2">
              {listaAtivosParados.length === 0 ? (
                <ListaVazia texto="Nenhum ativo parado." />
              ) : (
                listaAtivosParados.map((ativo) => (
                  <LinhaItem
                    key={ativo.id}
                    titulo={`${ativo.codigo} - ${ativo.nome}`}
                    detalhe={`${ativo.tipo} · ${ativo.criticidade}`}
                    badge={ativo.status}
                    onPress={() => router.push(`/(protected)/ativos/${ativo.id}`)}
                  />
                ))
              )}
            </View>
          </ChartCard>
        </View>

        <View className="min-w-[300px] flex-1">
          <ChartCard title="O.S. críticas">
            <View className="gap-2">
              {listaOrdensCriticas.length === 0 ? (
                <ListaVazia texto="Nenhuma O.S. crítica." />
              ) : (
                listaOrdensCriticas.map((ordem) => (
                  <LinhaItem
                    key={ordem.id}
                    titulo={ordem.numero}
                    detalhe={ordem.titulo}
                    badge={ordem.prioridade}
                    badgeVariant="default"
                    onPress={() => router.push(`/(protected)/ordens-servico/${ordem.id}`)}
                  />
                ))
              )}
            </View>
          </ChartCard>
        </View>

        <View className="min-w-[300px] flex-1">
          <ChartCard title="Materiais críticos">
            <View className="gap-2">
              {materiaisCriticos.length === 0 ? (
                <ListaVazia texto="Nenhum material com estoque baixo." />
              ) : (
                materiaisCriticos.map((material) => (
                  <LinhaItem
                    key={material.id}
                    titulo={`${material.codigo} - ${material.nome}`}
                    detalhe={`Estoque: ${material.estoqueAtual} / Mínimo: ${material.estoqueMinimo}`}
                    badge="Baixo"
                    badgeVariant="destructive"
                    onPress={() => router.push(`/materiais/${material.id}`)}
                  />
                ))
              )}
            </View>
          </ChartCard>
        </View>
      </View>
    </ScrollView>
  );
}
