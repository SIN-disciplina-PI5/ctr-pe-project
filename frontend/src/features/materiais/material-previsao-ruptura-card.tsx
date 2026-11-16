import { ActivityIndicator, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { usePrevisaoRupturaMaterial } from "./materiais.hooks";
import type { NivelRiscoRuptura } from "./materiais.types";

const RISCO_LABEL: Record<NivelRiscoRuptura, string> = {
  RUPTURA_IMINENTE: "Ruptura iminente (<= 7d)",
  ATENCAO_RUPTURA: "Atenção ruptura (<= 15d)",
  ABAIXO_MINIMO: "Abaixo do mínimo",
  SAUDAVEL: "Cobertura saudável",
  SEM_CONSUMO_RECENTE: "Sem consumo recente",
};

export function MaterialPrevisaoRupturaCard({ materialId }: { materialId: string }) {
  const { data: previsao, isLoading, isError } =
    usePrevisaoRupturaMaterial(materialId);

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardContent className="py-4">
          <ActivityIndicator size="small" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !previsao) {
    return (
      <Card className="mt-6">
        <CardContent className="py-4">
          <Text className="text-muted-foreground">
            Não foi possível calcular a previsão de ruptura deste material.
          </Text>
        </CardContent>
      </Card>
    );
  }

  const isAlerta =
    previsao.risco === "RUPTURA_IMINENTE" ||
    previsao.risco === "ATENCAO_RUPTURA" ||
    previsao.risco === "ABAIXO_MINIMO";

  return (
    <Card className="mt-6">
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Previsão de Ruptura de Estoque</CardTitle>
        <Badge variant={isAlerta ? "destructive" : "secondary"}>
          <Text>{RISCO_LABEL[previsao.risco]}</Text>
        </Badge>
      </CardHeader>
      <CardContent className="gap-2">
        <Text>
          Consumo médio mensal: {previsao.consumoMedioMensal} {previsao.unidade}/mês ({previsao.consumoMedioDiario} {previsao.unidade}/dia)
        </Text>
        <Text className="font-semibold">
          {previsao.diasParaRuptura !== null
            ? `Ruptura prevista em ${previsao.diasParaRuptura} dia(s)`
            : "Sem consumo registrado nos últimos 90 dias para estimar ruptura"}
        </Text>
        {previsao.sugestaoReposicao > 0 ? (
          <View className="mt-1 rounded-lg border border-border bg-background p-2.5">
            <Text variant="small" className="text-muted-foreground">
              Sugestão de reposição (cobertura de 60 dias + mínimo):{" "}
              <Text className="font-semibold text-foreground">
                +{previsao.sugestaoReposicao} {previsao.unidade}
              </Text>
            </Text>
          </View>
        ) : null}
      </CardContent>
    </Card>
  );
}
