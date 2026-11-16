import { router } from "expo-router";
import { Alert, Platform, View } from "react-native";

import { PermissionGate } from "@/components/domain/permission-gate";
import { QrCodeSvg } from "@/components/domain/qr-code-svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

interface AtivoQrEtiquetaCardProps {
  ativoId: string;
  empresaId: string;
  codigo: string;
  nome: string;
  tipo: string;
  criticidade: string;
}

export function buildAtivoQrPayload(codigo: string): string {
  return `CTRPE:ATIVO:${codigo.trim()}`;
}

export function AtivoQrEtiquetaCard({
  ativoId,
  empresaId,
  codigo,
  nome,
  tipo,
  criticidade,
}: AtivoQrEtiquetaCardProps) {
  const qrPayload = buildAtivoQrPayload(codigo);

  async function handleCopyPayload() {
    if (
      Platform.OS === "web" &&
      typeof navigator !== "undefined" &&
      navigator.clipboard
    ) {
      await navigator.clipboard.writeText(qrPayload);
      Alert.alert("Etiqueta copiada", `Payload copiado: ${qrPayload}`);
      return;
    }

    Alert.alert("Código da etiqueta QR", qrPayload);
  }

  function handleOpenServiceRequest() {
    router.push({
      pathname: "/ordens-servico/nova",
      params: {
        ativoId,
        empresaId,
        tipo: "CORRETIVA",
      },
    });
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Etiqueta QR Code do Ativo</CardTitle>
        <Badge variant="outline">
          <Text>{codigo}</Text>
        </Badge>
      </CardHeader>

      <CardContent className="gap-4">
        <View className="flex-row items-center gap-4 rounded-xl border border-border bg-background p-4">
          <QrCodeSvg value={qrPayload} size={132} />

          <View className="flex-1 gap-1.5">
            <Text className="text-base font-bold">{nome}</Text>
            <Text variant="small" className="text-muted-foreground">
              Código: {codigo}
            </Text>
            <Text variant="small" className="text-muted-foreground">
              Tipo: {tipo} · Criticidade: {criticidade}
            </Text>
            <Text variant="small" className="font-mono text-xs text-primary">
              {qrPayload}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2">
          <Button variant="outline" onPress={handleCopyPayload}>
            <Text>Copiar código QR</Text>
          </Button>
          <PermissionGate permission="workOrdersCreate">
            <Button onPress={handleOpenServiceRequest}>
              <Text>Abrir chamado neste ativo</Text>
            </Button>
          </PermissionGate>
        </View>
      </CardContent>
    </Card>
  );
}
