import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

import { PermissionGate } from "@/components/domain/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { apiClient } from "@/infrastructure/api/api-client";
import { endpoints } from "@/infrastructure/api/endpoints";
import { formatDateTime } from "@/lib/dates";

export interface PlanoManutencaoItem {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
  periodicidadeDias: number;
  antecedenciaAlertaDias: number;
  checklist?: string[] | null;
  ultimaExecucaoEm: string | null;
  proximaExecucaoEm: string;
  ativo: boolean;
  _count?: {
    ordensServico: number;
  };
}

interface Props {
  ativoId: string;
}

export function AtivoPlanosPreventivosCard({ ativoId }: Props) {
  const [planos, setPlanos] = useState<PlanoManutencaoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [periodicidadeDias, setPeriodicidadeDias] = useState("30");
  const [checklistText, setChecklistText] = useState("");

  const carregarPlanos = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get<PlanoManutencaoItem[]>(
        endpoints.planosManutencao.list,
        { params: { ativoId } },
      );
      setPlanos(data);
    } catch {
      setPlanos([]);
    } finally {
      setIsLoading(false);
    }
  }, [ativoId]);

  useEffect(() => {
    void carregarPlanos();
  }, [carregarPlanos]);

  async function handleCriarPlano() {
    const dias = Number.parseInt(periodicidadeDias, 10);
    if (!titulo.trim() || !descricao.trim() || Number.isNaN(dias) || dias < 1) {
      Alert.alert(
        "Dados inválidos",
        "Preencha título, descrição e periodicidade (mínimo 1 dia).",
      );
      return;
    }

    const checklist = checklistText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      await apiClient.post(endpoints.planosManutencao.create, {
        ativoId,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        periodicidadeDias: dias,
        ...(checklist.length > 0 ? { checklist } : {}),
      });
      setTitulo("");
      setDescricao("");
      setPeriodicidadeDias("30");
      setChecklistText("");
      setShowForm(false);
      await carregarPlanos();
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível cadastrar o plano de manutenção preventiva.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGerarOS(plano: PlanoManutencaoItem) {
    setGeneratingId(plano.id);
    try {
      const { data } = await apiClient.post<{
        ordemServico: { numero: string };
        materiaisInsuficientes: string[];
      }>(endpoints.planosManutencao.gerarOS(plano.id));

      const avisoEstoque =
        data.materiaisInsuficientes.length > 0
          ? `\n\nAtenção: materiais sem saldo suficiente (${data.materiaisInsuficientes.join(", ")}). Um alerta foi registrado.`
          : "";

      Alert.alert(
        "O.S. Preventiva Gerada",
        `Ordem de serviço ${data.ordemServico.numero} criada e próxima execução reagendada.${avisoEstoque}`,
      );
      await carregarPlanos();
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível gerar a ordem de serviço preventiva.",
      );
    } finally {
      setGeneratingId(null);
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Planos Preventivos</CardTitle>
        <PermissionGate permission="preventivePlansManage">
          <Button
            size="sm"
            variant={showForm ? "outline" : "default"}
            onPress={() => setShowForm((prev) => !prev)}
          >
            <Text>{showForm ? "Cancelar" : "+ Novo plano"}</Text>
          </Button>
        </PermissionGate>
      </CardHeader>

      <CardContent className="gap-3">
        {showForm ? (
          <View className="gap-2.5 rounded-lg border border-border bg-background p-3">
            <Text className="font-semibold">
              Novo plano de manutenção preventiva
            </Text>
            <Input
              placeholder="Título (ex: Lubrificação e inspeção mensal)"
              value={titulo}
              onChangeText={setTitulo}
            />
            <Input
              placeholder="Descrição técnica do procedimento"
              value={descricao}
              onChangeText={setDescricao}
            />
            <Input
              placeholder="Periodicidade em dias (ex: 30)"
              keyboardType="numeric"
              value={periodicidadeDias}
              onChangeText={setPeriodicidadeDias}
            />
            <Input
              placeholder="Checklist (1 item por linha, opcional)"
              multiline
              numberOfLines={3}
              className="h-20 py-2"
              value={checklistText}
              onChangeText={setChecklistText}
            />
            <Button disabled={isSubmitting} onPress={handleCriarPlano}>
              <Text>
                {isSubmitting ? "Salvando..." : "Salvar plano preventivo"}
              </Text>
            </Button>
          </View>
        ) : null}

        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : planos.length === 0 ? (
          <Text variant="muted">
            Nenhum plano preventivo cadastrado para este ativo.
          </Text>
        ) : (
          <View className="gap-3">
            {planos.map((plano) => {
              const vencido = new Date(plano.proximaExecucaoEm) <= new Date();
              return (
                <View
                  key={plano.id}
                  className="gap-2 rounded-lg border border-border p-3"
                >
                  <View className="flex-row items-center justify-between gap-2">
                    <Text className="flex-1 font-semibold">{plano.titulo}</Text>
                    <Badge variant={vencido ? "destructive" : "secondary"}>
                      <Text>A cada {plano.periodicidadeDias}d</Text>
                    </Badge>
                  </View>

                  <Text variant="muted">{plano.descricao}</Text>

                  <Text variant="small" className="text-muted-foreground">
                    Próxima execução: {formatDateTime(plano.proximaExecucaoEm)}
                    {plano._count?.ordensServico
                      ? ` · ${plano._count.ordensServico} OS geradas`
                      : ""}
                  </Text>

                  <PermissionGate permission="preventivePlansGenerate">
                    <View className="flex-row justify-end pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={generatingId === plano.id}
                        onPress={() => handleGerarOS(plano)}
                      >
                        <Text>
                          {generatingId === plano.id
                            ? "Gerando O.S..."
                            : "Gerar O.S. agora"}
                        </Text>
                      </Button>
                    </View>
                  </PermissionGate>
                </View>
              );
            })}
          </View>
        )}
      </CardContent>
    </Card>
  );
}
