import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
} from "react-native";
import { Redirect, useRouter } from "expo-router";

import { AuditoriaFiltros } from "@/features/auditoria/auditoria-filtros";
import { useAuditorias } from "@/features/auditoria/auditoria.hooks";
import type {
  LogAuditoria,
  TipoAcaoAuditoria,
} from "@/features/auditoria/auditoria.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { formatDateTime } from "@/lib/dates";
import { useAuthStore } from "@/store/auth-store";
import { useEmpresaStore } from "@/store/empresa-store";

const ACAO_LABELS: Record<TipoAcaoAuditoria, string> = {
  CRIACAO: "Criação",
  ALTERACAO: "Alteração",
  EXCLUSAO: "Exclusão",
  LOGIN: "Login",
  LOGOUT: "Logout",
  ENCERRAMENTO_OS: "Encerramento de O.S.",
  CANCELAMENTO_OS: "Cancelamento de O.S.",
};

const ENTIDADE_LABELS: Record<string, string> = {
  empresas: "Empresa",
  localizacoes: "Localização",
  usuarios: "Usuário",
  ativos: "Ativo",
  "ordens-servico": "Ordem de serviço",
  "paradas-ativos": "Parada de ativo",
  materiais: "Material",
  "ordens-servico-materiais": "Material de O.S.",
  "apontamentos-os": "Apontamento de O.S.",
  alertas: "Alerta",
};

function getActionVariant(
  acao: TipoAcaoAuditoria,
): "default" | "secondary" | "destructive" | "outline" {
  switch (acao) {
    case "EXCLUSAO":
    case "CANCELAMENTO_OS":
      return "destructive";

    case "ALTERACAO":
    case "ENCERRAMENTO_OS":
      return "secondary";

    case "LOGIN":
    case "LOGOUT":
      return "outline";

    default:
      return "default";
  }
}

function AuditoriaCard({
  log,
  onViewDetails,
}: {
  log: LogAuditoria;
  onViewDetails: () => void;
}) {
  return (
    <Card className="mb-3 gap-4 py-4">
      <CardHeader className="flex-row items-start justify-between gap-3 px-4">
        <View className="min-w-0 flex-1">
          <CardTitle className="text-base">
            {ENTIDADE_LABELS[log.entidade] ?? log.entidade}
          </CardTitle>

          <Text className="mt-1 text-sm text-muted-foreground">
            {formatDateTime(log.createdAt)}
          </Text>
        </View>

        <Badge variant={getActionVariant(log.acao)}>
          <Text>{ACAO_LABELS[log.acao]}</Text>
        </Badge>
      </CardHeader>

      <CardContent className="gap-3 px-4">
        <View>
          <Text className="text-xs text-muted-foreground">
            Usuário
          </Text>
          <Text className="text-sm font-medium text-foreground">
            {log.usuario?.nome ?? "Sistema"}
          </Text>

          {log.usuario?.email ? (
            <Text className="text-xs text-muted-foreground">
              {log.usuario.email}
            </Text>
          ) : null}
        </View>

        <View>
          <Text className="text-xs text-muted-foreground">
            ID da entidade
          </Text>
          <Text
            numberOfLines={1}
            className="text-sm text-foreground"
          >
            {log.entidadeId}
          </Text>
        </View>
      </CardContent>

      <CardFooter className="justify-end px-4">
        <Button
          variant="outline"
          size="sm"
          onPress={onViewDetails}
        >
          <Text>Ver detalhes</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}

function AuditoriaList({ empresaId }: { empresaId?: string }) {
  const router = useRouter();

  const [usuarioId, setUsuarioId] = useState<string | undefined>();
  const [entidade, setEntidade] = useState<string | undefined>();
  const [acao, setAcao] = useState<TipoAcaoAuditoria | undefined>();

  const {
    data: auditorias,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useAuditorias({
    empresaId,
    usuarioId,
    entidade,
    acao,
    limit: 100,
  });

  function clearFilters() {
    setUsuarioId(undefined);
    setEntidade(undefined);
    setAcao(undefined);
  }

  return (
    <View className="mx-auto flex-1 w-full max-w-6xl bg-background p-4">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-foreground">
          Auditoria
        </Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          Consulte as alterações relevantes realizadas no sistema.
        </Text>
      </View>

      <AuditoriaFiltros
        empresaId={empresaId}
        usuarioId={usuarioId}
        entidade={entidade}
        acao={acao}
        onUsuarioIdChange={setUsuarioId}
        onEntidadeChange={setEntidade}
        onAcaoChange={setAcao}
        onClear={clearFilters}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator />
          <Text className="text-muted-foreground">
            Carregando registros de auditoria...
          </Text>
        </View>
      ) : null}

      {isError ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className="text-center text-destructive">
            Não foi possível carregar os registros de auditoria.
          </Text>

          <Button variant="outline" onPress={() => refetch()}>
            <Text>Tentar novamente</Text>
          </Button>
        </View>
      ) : null}

      {!isLoading && !isError ? (
        <FlatList
          data={auditorias ?? []}
          keyExtractor={(item) => item.id}
          refreshing={isFetching}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <AuditoriaCard
              log={item}
              onViewDetails={() =>
                router.push(`/(protected)/auditoria/${item.id}`)
              }
            />
          )}
          ListEmptyComponent={
            <View className="items-center rounded-xl border border-dashed border-border p-8">
              <Text className="font-medium text-foreground">
                Nenhum registro encontrado
              </Text>
              <Text className="mt-1 text-center text-sm text-muted-foreground">
                Altere os filtros ou aguarde novas operações no sistema.
              </Text>
            </View>
          }
          contentContainerStyle={{
            paddingBottom: 24,
          }}
        />
      ) : null}
    </View>
  );
}

export default function AuditoriaScreen() {
  const user = useAuthStore((state) => state.user);
  const selectedEmpresaId = useEmpresaStore(
    (state) => state.empresaId,
  );

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!["ADMIN", "GESTOR"].includes(user.perfil)) {
    return <Redirect href="/403" />;
  }

  const empresaId =
    user.perfil === "ADMIN"
      ? selectedEmpresaId ?? undefined
      : user.empresaId ?? undefined;

  return <AuditoriaList empresaId={empresaId} />;
}