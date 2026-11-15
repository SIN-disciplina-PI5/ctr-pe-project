import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAtivos } from "@/features/ativos/ativos.hooks";
import type { Ativo } from "@/features/ativos/ativos.types";
import { apiClient } from "@/infrastructure/api/api-client";

export default function AtivoQrScanScreen() {
  const [rawCode, setRawCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [matchedAtivo, setMatchedAtivo] = useState<Ativo | null>(null);

  const { data: ativos } = useAtivos();

  async function handleLookup(inputValue?: string) {
    const query = (inputValue ?? rawCode).trim();
    if (!query) {
      setErrorMessage("Leia a etiqueta QR ou digite o código do ativo.");
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);
    setMatchedAtivo(null);

    try {
      const { data } = await apiClient.get<Ativo>(
        `/ativos/codigo/${encodeURIComponent(query)}`,
      );
      setMatchedAtivo(data);
    } catch {
      setErrorMessage(
        "Nenhum ativo ativo foi encontrado para este QR Code ou código na empresa atual.",
      );
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24, gap: 16 }}
    >
      <View className="gap-1">
        <Text className="text-2xl font-bold">Identificar Ativo por QR Code</Text>
        <Text className="text-sm text-muted-foreground">
          Aponte o leitor QR/código de barras ou informe o código da etiqueta do equipamento para abrir uma Ordem de Serviço.
        </Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Leitura da etiqueta</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          <Input
            autoFocus
            value={rawCode}
            onChangeText={setRawCode}
            onSubmitEditing={() => void handleLookup()}
            placeholder="Ex: CTRPE:ATIVO:BOM-001 ou BOM-001"
          />
          <Button disabled={isSearching} onPress={() => void handleLookup()}>
            <Text>{isSearching ? "Buscando ativo..." : "Identificar ativo"}</Text>
          </Button>
        </CardContent>
      </Card>

      {isSearching ? <ActivityIndicator /> : null}

      {errorMessage ? (
        <Text className="text-sm text-destructive">{errorMessage}</Text>
      ) : null}

      {matchedAtivo ? (
        <Card className="border-primary">
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle>{matchedAtivo.nome}</CardTitle>
            <Badge>
              <Text>{matchedAtivo.status}</Text>
            </Badge>
          </CardHeader>
          <CardContent className="gap-3">
            <Text className="text-sm text-muted-foreground">
              Código: {matchedAtivo.codigo} · Tipo: {matchedAtivo.tipo} · Criticidade:{" "}
              {matchedAtivo.criticidade}
            </Text>

            <View className="flex-row flex-wrap gap-2 pt-1">
              <Button
                onPress={() =>
                  router.push({
                    pathname: "/ordens-servico/nova",
                    params: {
                      ativoId: matchedAtivo.id,
                      empresaId: matchedAtivo.empresaId,
                      tipo: "CORRETIVA",
                    },
                  })
                }
              >
                <Text>Abrir O.S. Corretiva</Text>
              </Button>
              <Button
                variant="outline"
                onPress={() => router.push(`/ativos/${matchedAtivo.id}`)}
              >
                <Text>Ver ficha do ativo</Text>
              </Button>
            </View>
          </CardContent>
        </Card>
      ) : null}

      {ativos && ativos.length > 0 ? (
        <View className="gap-2 pt-2">
          <Text className="text-sm font-semibold text-muted-foreground">
            Acesso rápido (etiquetas cadastradas)
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {ativos.slice(0, 8).map((item) => (
              <Button
                key={item.id}
                size="sm"
                variant="outline"
                onPress={() => {
                  const payload = `CTRPE:ATIVO:${item.codigo}`;
                  setRawCode(payload);
                  void handleLookup(payload);
                }}
              >
                <Text>{item.codigo}</Text>
              </Button>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}
