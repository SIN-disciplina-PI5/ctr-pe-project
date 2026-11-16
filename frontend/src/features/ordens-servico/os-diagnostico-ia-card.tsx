import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { apiClient } from "@/infrastructure/api/api-client";
import { endpoints } from "@/infrastructure/api/endpoints";

export interface DiagnosticoAtivoResponse {
  ativo: {
    id: string;
    codigo: string;
    nome: string;
    tipo: string;
    marca: string | null;
    modelo: string | null;
  };
  resumoDiagnostico: string;
  causasProvaveis: Array<{
    causa: string;
    probabilidade: "ALTA" | "MEDIA" | "BAIXA";
    justificativa: string;
  }>;
  acoesRecomendadas: string[];
  materiaisSugeridos: Array<{
    materialId: string;
    codigo: string;
    nome: string;
    unidade: string;
    frequenciaHistorica: number;
    estoqueAtual: number;
    disponivelEmEstoque: boolean;
  }>;
  metricasHistoricas: {
    totalOsAnalisadas: number;
    osDoMesmoAtivo: number;
    mttrMinutos: number | null;
    tempoMedioParadaMinutos: number | null;
  };
}

interface Props {
  ordemServicoId: string;
}

const PROBABILIDADE_VARIANT = {
  ALTA: "destructive",
  MEDIA: "secondary",
  BAIXA: "outline",
} as const;

function extractErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { error?: unknown } } }).response
      ?.data?.error === "string"
  ) {
    return (error as { response: { data: { error: string } } }).response.data
      .error;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Não foi possível gerar o diagnóstico assistido por IA.";
}

export function OSDiagnosticoIACard({ ordemServicoId }: Props) {
  const [diagnostico, setDiagnostico] =
    useState<DiagnosticoAtivoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAnalisar() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data } = await apiClient.post<DiagnosticoAtivoResponse>(
        endpoints.ai.troubleshoot,
        { ordemServicoId },
      );
      setDiagnostico(data);
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Diagnóstico Assistido (IA)</CardTitle>
        <Button
          size="sm"
          variant={diagnostico ? "outline" : "default"}
          disabled={isLoading}
          onPress={handleAnalisar}
        >
          <Text>
            {isLoading
              ? "Analisando..."
              : diagnostico
                ? "Reanalisar"
                : "Sugerir diagnóstico"}
          </Text>
        </Button>
      </CardHeader>

      <CardContent className="gap-3">
        <Text variant="small" className="text-muted-foreground">
          Sugestão de apoio baseada no histórico. Valide o diagnóstico, o
          manual do fabricante e os procedimentos de segurança antes de
          qualquer intervenção.
        </Text>

        {!diagnostico && !isLoading && !errorMessage ? (
          <Text variant="muted">
            Cruza o sintoma desta OS com o histórico de manutenção do ativo
            para sugerir causas prováveis, checklist e peças em estoque.
          </Text>
        ) : null}

        {isLoading ? (
          <View className="flex-row items-center gap-2 py-2">
            <ActivityIndicator size="small" />
            <Text variant="muted">
              Consultando histórico de falhas e almoxarifado...
            </Text>
          </View>
        ) : null}

        {errorMessage ? (
          <Text className="text-destructive">{errorMessage}</Text>
        ) : null}

        {diagnostico ? (
          <View className="gap-4">
            <View className="gap-1">
              <Text className="font-semibold">Resumo técnico</Text>
              <Text>{diagnostico.resumoDiagnostico}</Text>
              <Text variant="small" className="text-muted-foreground">
                Base: {diagnostico.metricasHistoricas.totalOsAnalisadas} OS
                históricas ({diagnostico.metricasHistoricas.osDoMesmoAtivo}{" "}
                deste ativo)
                {diagnostico.metricasHistoricas.mttrMinutos != null
                  ? ` · MTTR médio: ${diagnostico.metricasHistoricas.mttrMinutos} min`
                  : ""}
              </Text>
            </View>

            <View className="gap-2">
              <Text className="font-semibold">Causas prováveis</Text>
              {diagnostico.causasProvaveis.map((item, idx) => (
                <View
                  key={`${item.causa}-${idx}`}
                  className="gap-1 rounded-md border border-border p-2.5"
                >
                  <View className="flex-row items-center justify-between gap-2">
                    <Text className="flex-1 font-medium">{item.causa}</Text>
                    <Badge variant={PROBABILIDADE_VARIANT[item.probabilidade]}>
                      <Text>{item.probabilidade}</Text>
                    </Badge>
                  </View>
                  <Text variant="muted">{item.justificativa}</Text>
                </View>
              ))}
            </View>

            <View className="gap-1.5">
              <Text className="font-semibold">Ações recomendadas</Text>
              {diagnostico.acoesRecomendadas.map((acao, idx) => (
                <Text key={`${acao}-${idx}`}>
                  {idx + 1}. {acao}
                </Text>
              ))}
            </View>

            {diagnostico.materiaisSugeridos.length > 0 ? (
              <View className="gap-2">
                <Text className="font-semibold">
                  Materiais usados em ocorrências similares
                </Text>
                {diagnostico.materiaisSugeridos.map((mat) => (
                  <View
                    key={mat.materialId}
                    className="flex-row items-center justify-between gap-2 rounded-md border border-border p-2.5"
                  >
                    <View className="flex-1">
                      <Text className="font-medium">
                        {mat.codigo} · {mat.nome}
                      </Text>
                      <Text variant="small" className="text-muted-foreground">
                        Usado em {mat.frequenciaHistorica} OS · Saldo:{" "}
                        {mat.estoqueAtual} {mat.unidade}
                      </Text>
                    </View>
                    <Badge
                      variant={
                        mat.disponivelEmEstoque ? "default" : "destructive"
                      }
                    >
                      <Text>
                        {mat.disponivelEmEstoque ? "Em estoque" : "Sem saldo"}
                      </Text>
                    </Badge>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}
      </CardContent>
    </Card>
  );
}
