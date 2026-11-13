import { router } from "expo-router";
import {
  Boxes,
  CirclePause,
  ClipboardList,
  Clock,
  PackageSearch,
  Timer,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { ChartCard } from "@/components/charts/chart-card";
import { GaugeChart } from "@/components/charts/gauge-chart";
import { StatCard } from "@/components/charts/stat-card";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { PRIORIDADE_OS_LABEL, STATUS_OS_LABEL } from "@/constants/status";
import { useAlertas } from "@/features/alertas/alertas.hooks";
import { useAtivos } from "@/features/ativos/ativos.hooks";
import {
  useDashboardAtivos,
  useDashboardMateriais,
  useDashboardOrdensServico,
  useDashboardResumo,
} from "@/features/dashboard/dashboard.hooks";
import { useOrdensServico } from "@/features/ordens-servico/ordens-servico.hooks";
import { useParadas } from "@/features/paradas/paradas.hooks";
import { useSelectedEmpresaId } from "@/hooks/use-selected-empresa";

const DASHBOARD_QUERY_OPTIONS = { refetchInterval: 45_000 };
const AVAILABILITY_PERIODS = [7, 30, 90] as const;

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

function DistribuicaoCard({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; value: number }>;
}) {
  return (
    <ChartCard title={title}>
      <View className="gap-2">
        {items.length === 0 ? (
          <ListaVazia texto="Nenhum dado disponível." />
        ) : (
          items.map((item) => (
            <View
              key={item.label}
              className="flex-row items-center justify-between rounded-xl bg-muted/60 px-3.5 py-3"
            >
              <Text className="text-sm text-foreground">{item.label}</Text>
              <Text className="font-semibold text-foreground">{item.value}</Text>
            </View>
          ))
        )}
      </View>
    </ChartCard>
  );
}

function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatElapsedTime(startedAt: string) {
  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(startedAt).getTime()) / 60_000),
  );
  const days = Math.floor(elapsedMinutes / 1_440);
  const hours = Math.floor((elapsedMinutes % 1_440) / 60);
  const minutes = elapsedMinutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
}

export default function DashboardScreen() {
  const empresaId = useSelectedEmpresaId();
  const [availabilityPeriodDays, setAvailabilityPeriodDays] = useState(30);

  const params = useMemo(
    () => ({ empresaId: empresaId ?? undefined }),
    [empresaId],
  );

  const resumo = useDashboardResumo(params, DASHBOARD_QUERY_OPTIONS);
  const dashboardAtivos = useDashboardAtivos(params, DASHBOARD_QUERY_OPTIONS);
  const dashboardOrdens = useDashboardOrdensServico(params, DASHBOARD_QUERY_OPTIONS);
  const dashboardMateriais = useDashboardMateriais(params, DASHBOARD_QUERY_OPTIONS);
  const ativos = useAtivos(
    { empresaId: empresaId ?? undefined },
    DASHBOARD_QUERY_OPTIONS,
  );
  const ordensServico = useOrdensServico(params, DASHBOARD_QUERY_OPTIONS);
  const alertasRecentes = useAlertas(
    { empresaId: empresaId ?? undefined, status: "ABERTO" },
    DASHBOARD_QUERY_OPTIONS,
  );
  const paradas = useParadas(
    { empresaId: empresaId ?? undefined },
    DASHBOARD_QUERY_OPTIONS,
  );

  const isLoading =
    resumo.isLoading ||
    dashboardAtivos.isLoading ||
    dashboardOrdens.isLoading ||
    dashboardMateriais.isLoading ||
    ativos.isLoading ||
    ordensServico.isLoading ||
    alertasRecentes.isLoading ||
    paradas.isLoading;
  const isError =
    resumo.isError ||
    dashboardAtivos.isError ||
    dashboardOrdens.isError ||
    dashboardMateriais.isError ||
    ativos.isError ||
    ordensServico.isError ||
    alertasRecentes.isError ||
    paradas.isError;

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
  const ativosDaEmpresa = ativos.data ?? [];
  const paradasDaEmpresa = paradas.data ?? [];
  const ordens = ordensServico.data ?? [];
  const listaAtivosParados = ativosDaEmpresa
    .filter((ativo) => ativo.status === "PARADO")
    .slice(0, 5);
  const listaOrdensCriticas = ordens
    .filter(
      (ordem) =>
        ordem.prioridade === "CRITICA" &&
        ordem.status !== "ENCERRADA" &&
        ordem.status !== "CANCELADA",
    )
    .slice(0, 5);
  const listaAlertasRecentes = alertasRecentes.data?.slice(0, 5) ?? [];
  const listaParadasAbertas = paradasDaEmpresa
    .filter((parada) => parada.status === "ABERTA")
    .slice(0, 5);

  const periodoFim = new Date();
  const periodoInicio = new Date(periodoFim);
  periodoInicio.setDate(periodoFim.getDate() - availabilityPeriodDays);

  const quantidadeAtivos = ativosDaEmpresa.filter((ativo) => ativo.ativo).length;
  const totalMinutosPeriodo = availabilityPeriodDays * 24 * 60;
  const tempoParadoPeriodo = paradasDaEmpresa.reduce((total, parada) => {
    if (!parada.impactaDisponibilidade || parada.status === "CANCELADA") return total;

    const inicioParada = new Date(parada.inicioEm);
    const fimParada = parada.fimEm ? new Date(parada.fimEm) : periodoFim;
    const inicioIntersecao = new Date(
      Math.max(inicioParada.getTime(), periodoInicio.getTime()),
    );
    const fimIntersecao = new Date(
      Math.min(fimParada.getTime(), periodoFim.getTime()),
    );

    if (fimIntersecao <= inicioIntersecao) return total;
    return total + (fimIntersecao.getTime() - inicioIntersecao.getTime()) / 60_000;
  }, 0);
  const capacidadeTotalMinutos = totalMinutosPeriodo * quantidadeAtivos;
  const disponibilidadePercentual =
    capacidadeTotalMinutos > 0
      ? Math.min(
          100,
          Math.max(
            0,
            ((capacidadeTotalMinutos - tempoParadoPeriodo) /
              capacidadeTotalMinutos) *
              100,
          ),
        )
      : null;

  const ativosPorStatus =
    dashboardAtivos.data?.ativosPorStatus.map((item) => ({
      label: formatEnumLabel(item.status),
      value: item.quantidade,
    })) ?? [];
  const osPorStatus = Object.entries(
    ordens.reduce<Record<string, number>>((acc, ordem) => {
      acc[ordem.status] = (acc[ordem.status] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([status, quantidade]) => ({
    label: STATUS_OS_LABEL[status as keyof typeof STATUS_OS_LABEL] ?? status,
    value: quantidade,
  }));
  const osPorPrioridade =
    dashboardOrdens.data?.osPorPrioridade.map((item) => ({
      label:
        PRIORIDADE_OS_LABEL[
          item.prioridade as keyof typeof PRIORIDADE_OS_LABEL
        ] ?? item.prioridade,
      value: item.quantidade,
    })) ?? [];

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-5 p-5 md:p-8"
    >
      <View className="gap-1">
        <Text className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </Text>
        <Text className="text-sm text-muted-foreground">
          Visão geral da operação de manutenção.
        </Text>
      </View>

      <ChartCard
        title="Disponibilidade da frota"
        subtitle="Paradas que impactam disponibilidade no período"
      >
        <View className="gap-4">
          <View className="flex-row flex-wrap gap-2">
            {AVAILABILITY_PERIODS.map((days) => {
              const selected = availabilityPeriodDays === days;
              return (
                <Pressable
                  key={days}
                  onPress={() => setAvailabilityPeriodDays(days)}
                  className={
                    selected
                      ? "rounded-md bg-primary px-3 py-2"
                      : "rounded-md border border-border bg-background px-3 py-2"
                  }
                >
                  <Text
                    className={
                      selected
                        ? "text-sm font-medium text-primary-foreground"
                        : "text-sm font-medium text-foreground"
                    }
                  >
                    {days} dias
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View className="items-center">
            <GaugeChart
              value={disponibilidadePercentual ?? 0}
              label="disponibilidade"
            />
          </View>
          <Text className="text-center text-sm text-muted-foreground">
            {quantidadeAtivos} ativos considerados · {Math.round(tempoParadoPeriodo / 60)}h de indisponibilidade acumulada
          </Text>
        </View>
      </ChartCard>

      <View className="flex-row flex-wrap gap-4">
        <StatCard label="Ativos totais" value={ativosTotais} icon={Boxes} />
        <StatCard
          label="Máquinas paradas"
          value={indicadores?.maquinasParadas ?? 0}
          icon={CirclePause}
          alerta={(indicadores?.maquinasParadas ?? 0) > 0}
          onPress={() => router.push("/(protected)/(tabs)/ativos?status=PARADO")}
        />
        <StatCard
          label="O.S. abertas"
          value={indicadores?.osAbertas ?? 0}
          icon={ClipboardList}
          onPress={() => router.push("/(protected)/(tabs)/ordens-servico?status=ABERTA")}
        />
        <StatCard
          label="O.S. aguardando peça"
          value={indicadores?.osAguardandoPeca ?? 0}
          icon={PackageSearch}
          onPress={() =>
            router.push("/(protected)/(tabs)/ordens-servico?status=AGUARDANDO_PECA")
          }
        />
        <StatCard
          label="O.S. atrasadas"
          value={indicadores?.osAtrasadas ?? 0}
          icon={Clock}
          alerta={(indicadores?.osAtrasadas ?? 0) > 0}
          onPress={() => router.push("/(protected)/(tabs)/ordens-servico")}
        />
        <StatCard
          label="Tempo médio parado"
          value={`${indicadores?.tempoMedioParadoMinutos ?? 0} min`}
          icon={Timer}
          onPress={() => router.push("/(protected)/(tabs)/paradas")}
        />
      </View>

      <View className="flex-row flex-wrap gap-4">
        <View className="min-w-[280px] flex-1">
          <DistribuicaoCard title="Ativos por status" items={ativosPorStatus} />
        </View>
        <View className="min-w-[280px] flex-1">
          <DistribuicaoCard title="O.S. por status" items={osPorStatus} />
        </View>
        <View className="min-w-[280px] flex-1">
          <DistribuicaoCard title="O.S. por prioridade" items={osPorPrioridade} />
        </View>
      </View>

      <View className="flex-row flex-wrap gap-4">
        <View className="min-w-[300px] flex-1">
          <ChartCard title="Paradas abertas">
            <View className="gap-2">
              {listaParadasAbertas.length === 0 ? (
                <ListaVazia texto="Nenhuma parada aberta." />
              ) : (
                listaParadasAbertas.map((parada) => (
                  <LinhaItem
                    key={parada.id}
                    titulo={parada.motivo ?? "Parada sem motivo informado"}
                    detalhe={`Ativo: ${parada.ativoId}`}
                    badge={formatElapsedTime(parada.inicioEm)}
                    badgeVariant="destructive"
                    onPress={() => router.push(`/(protected)/paradas/${parada.id}`)}
                  />
                ))
              )}
            </View>
          </ChartCard>
        </View>
        <View className="min-w-[300px] flex-1">
          <ChartCard
            title="Alertas recentes"
            subtitle="Alertas em aberto, do mais novo ao mais antigo"
          >
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
