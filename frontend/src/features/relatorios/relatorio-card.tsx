import { ActivityIndicator, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { formatDate, formatDateTime } from "@/lib/dates";

import type { ReportJob, ReportJobStatus } from "./relatorios.types";
import { formatBytes, REPORT_STATUS_LABEL, REPORT_TYPE_LABEL } from "./relatorios.utils";

const STATUS_VARIANT: Record<
  ReportJobStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  queued: "outline",
  running: "secondary",
  done: "default",
  failed: "destructive",
};

function horario(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", { timeStyle: "short" }).format(
    new Date(value),
  );
}

type Props = {
  job: ReportJob;
  downloading: boolean;
  onDownload: (job: ReportJob) => void;
};

export function RelatorioCard({ job, downloading, onDownload }: Props) {
  const titulo = job.report?.title ?? job.request.split("\n")[0] ?? "Relatório";

  return (
    <Card className="mb-3 gap-3 py-4" testID={`relatorio-${job.id}`}>
      <CardHeader className="flex-row items-start justify-between gap-3 px-4">
        <View className="min-w-0 flex-1">
          <CardTitle className="text-base" numberOfLines={2}>
            {titulo}
          </CardTitle>
          <Text className="mt-1 text-sm text-muted-foreground">
            Solicitado em {formatDateTime(job.createdAt)}
            {job.report ? ` · ${REPORT_TYPE_LABEL[job.report.type]}` : ""}
          </Text>
        </View>
        <Badge variant={STATUS_VARIANT[job.status]}>
          <Text>{REPORT_STATUS_LABEL[job.status]}</Text>
        </Badge>
      </CardHeader>

      <CardContent className="gap-2 px-4">
        <Text className="text-sm text-foreground" numberOfLines={3}>
          {job.request}
        </Text>

        {job.status === "running" ? (
          <View className="flex-row items-center gap-2">
            <ActivityIndicator size="small" />
            <Text className="text-sm text-muted-foreground">
              Gerando o relatório. Isso pode levar alguns minutos.
            </Text>
          </View>
        ) : null}

        {job.status === "queued" ? (
          <Text className="text-sm text-muted-foreground">
            {job.nextAttemptAt
              ? `A tentativa anterior falhou. Nova tentativa às ${horario(job.nextAttemptAt)} (${job.attempts + 1} de ${job.maxAttempts}).`
              : "Aguardando processamento."}
          </Text>
        ) : null}

        {job.status === "failed" ? (
          <Text className="text-sm text-destructive">
            {job.error?.message ?? "Não foi possível gerar o relatório."} Solicite
            novamente se precisar.
          </Text>
        ) : null}

        {job.status === "done" && job.expired ? (
          <Text className="text-sm text-muted-foreground">
            Este relatório expirou após 30 dias. Solicite novamente se precisar.
          </Text>
        ) : null}

        {job.status === "done" && job.downloadUrl ? (
          <View className="flex-row flex-wrap items-center justify-between gap-2">
            <Text className="text-sm text-muted-foreground">
              {job.report
                ? `PDF de ${formatBytes(job.report.sizeBytes)} · disponível até ${formatDate(job.report.expiresAt)}`
                : "PDF disponível"}
            </Text>
            <Button
              size="sm"
              onPress={() => onDownload(job)}
              disabled={downloading}
              accessibilityLabel={`Baixar PDF de ${titulo}`}
            >
              <Text>{downloading ? "Baixando..." : "Baixar PDF"}</Text>
            </Button>
          </View>
        ) : null}
      </CardContent>
    </Card>
  );
}
