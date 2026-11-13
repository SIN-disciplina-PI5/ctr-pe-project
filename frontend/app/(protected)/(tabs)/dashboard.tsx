import { router } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function IndicadorCard({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const card = (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Text className="text-3xl font-semibold text-foreground">{value}</Text>
      </CardContent>
    </Card>
  );

  if (!onPress) {
    return <View className="min-w-[47%] flex-1">{card}</View>;
  }

  return (
    <Pressable className="min-w-[47%] flex-1" onPress={onPress}>
      {card}
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
    <Card className="min-w-[280px] flex-1 border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="gap-2">
        {items.length === 0 ? (
          <Text className="text-sm text-muted-foreground">Nenhum dado disponível.</Text>
        ) : (
          items.map((item) => (
            <View
              key={item.label}
              className="flex-row items-center justify-between rounded-md bg-muted px-3 py-2"
            >
              <Text className="text-sm text-foreground">{item.label}</Text>
              <Text className="font-semibold text-foreground">{item.value}</Text>
            </View>
          ))
        )}
      </CardContent>
    </Card>
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

  const params = useMemo(
    () => ({
      empresaId: empresaId ?? undefined,
    }),
    [empresaId],
  );

  const resumo = useDashboardResumo(params, DASHBOARD_QUERY_OPTIONS);
  const dashboardAtivos = useDashboardAtivos(params, DASHBOARD_QUERY_OPTIONS);
  const dashboardOrdens = useDashboardOrdensServico(
    params,
    DASHBOARD_QUERY_OPTIONS,
  );
  const dashboardMateriais = useDashboardMateriais(
    params,
    DASHBOARD_QUERY_OPTIONS,
  );

  const ativosParados = useAtivos(
    {
      empresaId: empresaId ?? undefined,
      status: "PARADO",
    },
    DASHBOARD_QUERY_OPTIONS,
  );

  const ordensServico = useOrdensServico(params, DASHBOARD_QUERY_OPTIONS);

  const alertasRecentes = useAlertas(
    {
      empresaId: empresaId ?? undefined,
      status: "ABERTO",
    },
    DASHBOARD_QUERY_OPTIONS,
  );

  const paradasAbertas = useParadas(
    {
      empresaId: empresaId ?? undefined,
      status: "ABERTA",
    },
    DASHBOARD_QUERY_OPTIONS,
  );

  const isLoading =
    resumo.isLoading ||
    dashboardAtivos.isLoading ||
    dashboardOrdens.isLoading ||
    dashboardMateriais.isLoading ||
    ativosParados.isLoading ||
    ordensServico.isLoading ||
    alertasRecentes.isLoading ||
    paradasAbertas.isLoading;

  const isError =
    resumo.isError ||
    dashboardAtivos.isError ||
    dashboardOrdens.isError ||
    dashboardMateriais.isError ||
    ativosParados.isError ||
    ordensServico.isError ||
    alertasRecentes.isError ||
    paradasAbertas.isError;

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
  const ordens = ordensServico.data ?? [];
  const listaOrdensCriticas = ordens
    .filter(
      (ordem) =>
        ordem.prioridade === "CRITICA" &&
        ordem.status !== "ENCERRADA" &&
        ordem.status !== "CANCELADA",
    )
    .slice(0, 5);
  const listaAlertasRecentes = alertasRecentes.data?.slice(0, 5) ?? [];
  const listaParadasAbertas = paradasAbertas.data?.slice(0, 5) ?? [];

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
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 px-4 py-6 pb-6">
      <View className="gap-1">
        <Text className="text-2xl font-bold text-foreground">Dashboard</Text>
        <Text className="text-sm text-muted-foreground">
          Visão geral da operação de manutenção.
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        <IndicadorCard label="Ativos totais" value={String(ativosTotais)} />
        <IndicadorCard
          label="Maquinas paradas"
          value={String(indicadores?.maquinasParadas ?? 0)}
          onPress={() => router.push("/(protected)/(tabs)/ativos?status=PARADO")}
        />
        <IndicadorCard
          label="O.S. abertas"
          value={String(indicadores?.osAbertas ?? 0)}
          onPress={() => router.push("/(protected)/(tabs)/ordens-servico?status=ABERTA")}
        />
        <IndicadorCard
          label="O.S. aguardando peca"
          value={String(indicadores?.osAguardandoPeca ?? 0)}
          onPress={() =>
            router.push("/(protected)/(tabs)/ordens-servico?status=AGUARDANDO_PECA")
          }
        />
        <IndicadorCard
          label="O.S. atrasadas"
          value={String(indicadores?.osAtrasadas ?? 0)}
          onPress={() => router.push("/(protected)/(tabs)/ordens-servico")}
        />
        <IndicadorCard
          label="Tempo médio parado"
          value={`${indicadores?.tempoMedioParadoMinutos ?? 0} min`}
          onPress={() => router.push("/(protected)/(tabs)/paradas")}
        />
      </View>

      <View className="flex-row flex-wrap gap-3">
        <DistribuicaoCard title="Ativos por status" items={ativosPorStatus} />
        <DistribuicaoCard title="O.S. por status" items={osPorStatus} />
        <DistribuicaoCard title="O.S. por prioridade" items={osPorPrioridade} />
      </View>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Paradas abertas</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {listaParadasAbertas.length === 0 ? (
            <Text className="text-sm text-muted-foreground">
              Nenhuma parada aberta.
            </Text>
          ) : (
            listaParadasAbertas.map((parada) => (
              <Pressable
                key={parada.id}
                onPress={() => router.push(`/(protected)/paradas/${parada.id}`)}
                className="rounded-md border border-border bg-background px-3 py-3"
              >
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-1 gap-1">
                    <Text className="font-medium text-foreground">
                      {parada.motivo ?? "Parada sem motivo informado"}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Ativo: {parada.ativoId}
                    </Text>
                  </View>
                  <Badge variant="destructive">
                    <Text>{formatElapsedTime(parada.inicioEm)}</Text>
                  </Badge>
                </View>
              </Pressable>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Alertas recentes</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {listaAlertasRecentes.length === 0 ? (
            <Text className="text-sm text-muted-foreground">
              Nenhum alerta recente.
            </Text>
          ) : (
            listaAlertasRecentes.map((alerta) => (
              <Pressable
                key={alerta.id}
                onPress={() => {
                  if (alerta.ordemServicoId) {
                    router.push(`/(protected)/ordens-servico/${alerta.ordemServicoId}`);
                    return;
                  }

                  if (alerta.ativoId) {
                    router.push(`/(protected)/ativos/${alerta.ativoId}`);
                  }
                }}
                className="rounded-md border border-border bg-background px-3 py-3"
              >
                <View className="mb-1 flex-row items-center justify-between gap-3">
                  <Text className="flex-1 font-medium text-foreground">{alerta.titulo}</Text>
                  <Badge variant="secondary">
                    <Text>{alerta.severidade}</Text>
                  </Badge>
                </View>
                <Text className="text-sm text-muted-foreground">{alerta.mensagem}</Text>
              </Pressable>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Ativos parados</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {listaAtivosParados.length === 0 ? (
            <Text className="text-sm text-muted-foreground">
              Nenhum ativo parado.
            </Text>
          ) : (
            listaAtivosParados.map((ativo) => (
              <Pressable
                key={ativo.id}
                onPress={() => router.push(`/(protected)/ativos/${ativo.id}`)}
                className="rounded-md border border-border bg-background px-3 py-3"
              >
                <View className="mb-1 flex-row items-center justify-between gap-3">
                  <Text className="font-medium text-foreground">
                    {ativo.codigo} - {ativo.nome}
                  </Text>
                  <Badge variant="secondary">
                    <Text>{ativo.status}</Text>
                  </Badge>
                </View>
                <Text className="text-sm text-muted-foreground">
                  {ativo.tipo} · {ativo.criticidade}
                </Text>
              </Pressable>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base text-foreground">O.S. criticas</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {listaOrdensCriticas.length === 0 ? (
            <Text className="text-sm text-muted-foreground">
              Nenhuma O.S. critica.
            </Text>
          ) : (
            listaOrdensCriticas.map((ordem) => (
              <Pressable
                key={ordem.id}
                onPress={() => router.push(`/(protected)/ordens-servico/${ordem.id}`)}
                className="rounded-md border border-border bg-background px-3 py-3"
              >
                <View className="mb-1 flex-row items-center justify-between gap-3">
                  <Text className="font-medium text-foreground">{ordem.numero}</Text>
                  <Badge>
                    <Text>{ordem.prioridade}</Text>
                  </Badge>
                </View>
                <Text className="text-sm text-muted-foreground">{ordem.titulo}</Text>
              </Pressable>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Materiais criticos</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {materiaisCriticos.length === 0 ? (
            <Text className="text-sm text-muted-foreground">
              Nenhum material com estoque baixo.
            </Text>
          ) : (
            materiaisCriticos.map((material) => (
              <Pressable
                key={material.id}
                onPress={() => router.push(`/materiais/${material.id}`)}
                className="rounded-md border border-border bg-background px-3 py-3"
              >
                <View className="mb-1 flex-row items-center justify-between gap-3">
                  <Text className="font-medium text-foreground">
                    {material.codigo} - {material.nome}
                  </Text>
                  <Badge variant="destructive">
                    <Text>Baixo</Text>
                  </Badge>
                </View>
                <Text className="text-sm text-muted-foreground">
                  Estoque: {material.estoqueAtual} / Minimo: {material.estoqueMinimo}
                </Text>
              </Pressable>
            ))
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
