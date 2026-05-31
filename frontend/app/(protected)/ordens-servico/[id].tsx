import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { OrdemServicoActions } from "@/components/domain/ordem-servico-actions";
import { PrioridadeBadge } from "@/components/domain/prioridade-badge";
import { StatusBadge } from "@/components/domain/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { TIPO_OS_LABEL } from "@/constants/status";
import { useOrdemServico } from "@/features/ordens-servico/ordens-servico.hooks";
import { formatDateTime } from "@/lib/dates";

function Linha({ label, value }: { label: string; value?: string | null }) {
  return (
    <View className="flex-row items-center justify-between gap-3 py-1">
      <Text variant="muted">{label}</Text>
      <Text className="flex-1 text-right">{value ?? "—"}</Text>
    </View>
  );
}

export default function OrdemServicoDetalheScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: os, isLoading, isError, refetch } = useOrdemServico(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || !os) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-6">
        <Text variant="muted">Não foi possível carregar a ordem de serviço.</Text>
        <Button variant="outline" size="sm" onPress={() => refetch()}>
          <Text>Tentar novamente</Text>
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
    >
      <View className="flex-row items-center justify-between gap-2">
        <Text variant="small" className="text-muted-foreground">
          {os.numero}
        </Text>
        <StatusBadge status={os.status} />
      </View>

      <Text variant="h4">{os.titulo}</Text>

      <View className="flex-row items-center gap-2">
        <PrioridadeBadge prioridade={os.prioridade} />
        <Text variant="muted">{TIPO_OS_LABEL[os.tipo]}</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Descrição</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>{os.descricao}</Text>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <Linha
            label="Ativo"
            value={os.ativo ? `${os.ativo.codigo} · ${os.ativo.nome}` : null}
          />
          <Linha label="Responsável" value={os.responsavel?.nome} />
          <Linha label="Aberta em" value={formatDateTime(os.abertaEm)} />
          <Linha label="Iniciada em" value={formatDateTime(os.iniciadaEm)} />
          <Linha label="Prazo" value={formatDateTime(os.prazoEm)} />
          <Linha label="Encerrada em" value={formatDateTime(os.encerradaEm)} />
        </CardContent>
      </Card>

      {os.diagnostico || os.solucao ? (
        <Card>
          <CardHeader>
            <CardTitle>Diagnóstico e solução</CardTitle>
          </CardHeader>
          <CardContent className="gap-2">
            <Linha label="Diagnóstico" value={os.diagnostico} />
            <Linha label="Solução" value={os.solucao} />
          </CardContent>
        </Card>
      ) : null}

      <OrdemServicoActions ordemServico={os} />

      <Button
        variant="outline"
        onPress={() =>
          router.push({
            pathname: "/ordens-servico/[id]-editar",
            params: { id: os.id },
          })
        }
      >
        <Text>Editar</Text>
      </Button>
    </ScrollView>
  );
}
