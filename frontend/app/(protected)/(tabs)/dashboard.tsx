import { router } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function IndicadorCard({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const content = (
    <Card className="min-w-[47%] flex-1 border-border bg-card">
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

  if (!onPress) return content;

  return <Pressable onPress={onPress}>{content}</Pressable>;
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

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 pb-6">
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
      </View>

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