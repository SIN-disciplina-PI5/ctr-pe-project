import { router } from "expo-router";
import { Pressable, View } from "react-native";

import { RoleGate } from "@/components/domain/role-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import {
  useIgnorarAlerta,
  useMarcarAlertaLido,
  useResolverAlerta,
} from "@/features/alertas/alertas.hooks";
import { formatDateTime } from "@/lib/dates";
import type { Alerta, Severidade, StatusAlerta, TipoAlerta } from "@/types/alerta";

const SEVERIDADE_LABEL: Record<Severidade, string> = {
  BAIXA: "Baixa",
  MEDIA: "Media",
  ALTA: "Alta",
  CRITICA: "Critica",
};

const STATUS_LABEL: Record<StatusAlerta, string> = {
  ABERTO: "Aberto",
  LIDO: "Lido",
  RESOLVIDO: "Resolvido",
  IGNORADO: "Ignorado",
};

const TIPO_LABEL: Record<TipoAlerta, string> = {
  ATIVO_PARADO: "Ativo parado",
  OS_ATRASADA: "O.S. atrasada",
  AGUARDANDO_PECA: "Aguardando peca",
  ESTOQUE_BAIXO: "Estoque baixo",
  CUSTO_ALTO: "Custo alto",
  OUTRO: "Outro",
};

const SEVERIDADE_CLASSES: Record<Severidade, string> = {
  BAIXA: "bg-slate-100 text-slate-700",
  MEDIA: "bg-blue-100 text-blue-700",
  ALTA: "bg-amber-100 text-amber-700",
  CRITICA: "bg-rose-100 text-rose-700",
};

const STATUS_CLASSES: Record<StatusAlerta, string> = {
  ABERTO: "bg-amber-100 text-amber-700",
  LIDO: "bg-blue-100 text-blue-700",
  RESOLVIDO: "bg-emerald-100 text-emerald-700",
  IGNORADO: "bg-slate-100 text-slate-700",
};

type Props = {
  alerta: Alerta;
};

export function AlertaCard({ alerta }: Props) {
  const marcarLido = useMarcarAlertaLido();
  const resolver = useResolverAlerta();
  const ignorar = useIgnorarAlerta();

  function abrirRelacionada() {
    if (alerta.ordemServicoId) {
      router.push(`/(protected)/ordens-servico/${alerta.ordemServicoId}`);
      return;
    }

    if (alerta.ativoId) {
      router.push(`/(protected)/ativos/${alerta.ativoId}`);
    }
  }

  const temDestino = Boolean(alerta.ordemServicoId || alerta.ativoId);

  return (
    <Card>
      <CardContent className="gap-3 p-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <Text className="text-base font-semibold text-foreground">
              {alerta.titulo}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {alerta.mensagem}
            </Text>
          </View>

          <View className={`rounded-full px-2 py-1 ${SEVERIDADE_CLASSES[alerta.severidade]}`}>
            <Text className="text-xs font-medium">
              {SEVERIDADE_LABEL[alerta.severidade]}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2">
          <View className={`rounded-full px-2 py-1 ${STATUS_CLASSES[alerta.status]}`}>
            <Text className="text-xs font-medium">{STATUS_LABEL[alerta.status]}</Text>
          </View>

          <View className="rounded-full bg-slate-100 px-2 py-1">
            <Text className="text-xs font-medium text-slate-700">
              {TIPO_LABEL[alerta.tipo]}
            </Text>
          </View>
        </View>

        <Text className="text-xs text-muted-foreground">
          Gerado em: {formatDateTime(alerta.geradoEm)}
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {temDestino ? (
            <Button variant="outline" size="sm" onPress={abrirRelacionada}>
              <Text>Abrir</Text>
            </Button>
          ) : null}

          {alerta.status === "ABERTO" ? (
            <Button
              size="sm"
              variant="secondary"
              onPress={() => marcarLido.mutate(alerta.id)}
              disabled={marcarLido.isPending}
            >
              <Text>Lido</Text>
            </Button>
          ) : null}

          <RoleGate perfis={["ADMIN", "GESTOR", "SUPERVISOR"]}>
            {alerta.status !== "RESOLVIDO" && alerta.status !== "IGNORADO" ? (
              <>
                <Button
                  size="sm"
                  onPress={() => resolver.mutate(alerta.id)}
                  disabled={resolver.isPending}
                >
                  <Text>Resolver</Text>
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onPress={() => ignorar.mutate(alerta.id)}
                  disabled={ignorar.isPending}
                >
                  <Text>Ignorar</Text>
                </Button>
              </>
            ) : null}
          </RoleGate>
        </View>
      </CardContent>
    </Card>
  );
}