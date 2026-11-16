import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { FileDown } from "lucide-react-native";

import { PermissionRoute } from "@/components/domain/permission-gate";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { RelatorioCard } from "@/features/relatorios/relatorio-card";
import { RelatorioForm } from "@/features/relatorios/relatorio-form";
import { useBaixarRelatorio, useRelatorios } from "@/features/relatorios/relatorios.hooks";
import { DownloadUnavailableError } from "@/features/relatorios/relatorios.service";
import type { ReportJob, ReportJobStatus } from "@/features/relatorios/relatorios.types";
import {
  apiErrorMessage,
  REPORT_POLLING_MS,
  REPORT_STATUS_LABEL,
} from "@/features/relatorios/relatorios.utils";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { notify } from "@/store/toast-store";

const PAGE_SIZE = 10;
const FILTROS: Array<ReportJobStatus | "all"> = ["all", "queued", "running", "done", "failed"];
const FILTRO_LABEL: Record<ReportJobStatus | "all", string> = {
  all: "Todos",
  ...REPORT_STATUS_LABEL,
};

export default function RelatoriosScreen() {
  return (
    <PermissionRoute permission="reportsUse">
      <RelatoriosContent />
    </PermissionRoute>
  );
}

function RelatoriosContent() {
  const empresaId = useAuthStore((state) => state.user?.empresaId);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="mx-auto w-full max-w-4xl gap-4 p-4 pb-8"
    >
      <View>
        <Text className="text-2xl font-bold text-foreground">Relatórios</Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          Solicite relatórios em PDF com os dados da operação e baixe quando
          estiverem prontos.
        </Text>
      </View>

      {empresaId ? (
        <>
          <RelatorioForm />
          <RelatoriosLista />
        </>
      ) : (
        <EmptyState
          icon={FileDown}
          title="Relatórios indisponíveis para este usuário"
          description="Os relatórios são gerados para a empresa vinculada ao seu usuário. Entre com um usuário de empresa para solicitá-los."
        />
      )}
    </ScrollView>
  );
}

function RelatoriosLista() {
  const [status, setStatus] = useState<ReportJobStatus | "all">("all");
  const [page, setPage] = useState(1);
  const lista = useRelatorios({
    page,
    pageSize: PAGE_SIZE,
    ...(status === "all" ? {} : { status }),
  });
  const baixar = useBaixarRelatorio();

  const totalPages = Math.max(1, Math.ceil((lista.data?.total ?? 0) / PAGE_SIZE));

  function filtrar(novo: ReportJobStatus | "all") {
    setStatus(novo);
    setPage(1);
  }

  function onDownload(job: ReportJob) {
    baixar.mutate(job, {
      onError: (error) =>
        notify.error(
          "Não foi possível baixar o relatório",
          error instanceof DownloadUnavailableError
            ? error.message
            : apiErrorMessage(error, "Tente novamente em instantes."),
        ),
    });
  }

  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap items-center justify-between gap-2">
        <Text className="text-lg font-semibold text-foreground">Meus relatórios</Text>
        <View className="flex-row items-center gap-3">
          {lista.data?.hasActiveJobs ? (
            <View className="flex-row items-center gap-2" accessibilityLiveRegion="polite">
              <ActivityIndicator size="small" />
              <Text className="text-xs text-muted-foreground">
                Atualizando a cada {REPORT_POLLING_MS / 1000} s
              </Text>
            </View>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onPress={() => lista.refetch()}
            disabled={lista.isFetching}
            accessibilityLabel="Atualizar lista de relatórios"
          >
            <Text>Atualizar</Text>
          </Button>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {FILTROS.map((filtro) => {
          const selecionado = filtro === status;
          return (
            <Pressable
              key={filtro}
              onPress={() => filtrar(filtro)}
              accessibilityRole="button"
              accessibilityState={{ selected: selecionado }}
              className={cn(
                "rounded-full px-3 py-1",
                selecionado ? "bg-primary" : "border border-border bg-background",
              )}
            >
              <Text
                variant="small"
                className={selecionado ? "text-primary-foreground" : "text-foreground"}
              >
                {FILTRO_LABEL[filtro]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {lista.isLoading ? (
        <View className="items-center gap-3 py-8">
          <ActivityIndicator />
          <Text className="text-muted-foreground">Carregando relatórios...</Text>
        </View>
      ) : null}

      {lista.isError ? (
        <View className="items-center gap-3 py-8">
          <Text className="text-center text-destructive">
            {apiErrorMessage(lista.error, "Não foi possível carregar os relatórios.")}
          </Text>
          <Button variant="outline" onPress={() => lista.refetch()}>
            <Text>Tentar novamente</Text>
          </Button>
        </View>
      ) : null}

      {lista.data && !lista.isError ? (
        <>
          {lista.data.items.length === 0 ? (
            <EmptyState
              icon={FileDown}
              title="Nenhum relatório encontrado"
              description={
                status === "all"
                  ? "Use o formulário acima para solicitar o primeiro relatório."
                  : "Não há relatórios com este status."
              }
            />
          ) : (
            <View>
              {lista.data.items.map((job) => (
                <RelatorioCard
                  key={job.id}
                  job={job}
                  downloading={baixar.isPending && baixar.variables?.id === job.id}
                  onDownload={onDownload}
                />
              ))}
            </View>
          )}

          {totalPages > 1 ? (
            <View className="flex-row items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onPress={() => setPage((atual) => atual - 1)}
              >
                <Text>Anterior</Text>
              </Button>
              <Text className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </Text>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onPress={() => setPage((atual) => atual + 1)}
              >
                <Text>Próxima</Text>
              </Button>
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}
