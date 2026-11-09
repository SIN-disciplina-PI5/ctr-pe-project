import { Redirect, router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useAuditoria } from "@/features/auditoria/auditoria.hooks";
import {
  ACAO_LABELS,
  ENTIDADE_LABELS,
  getActionVariant,
} from "@/features/auditoria/auditoria.labels";
import { formatDateTime } from "@/lib/dates";
import { useAuthStore } from "@/store/auth-store";

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text className="text-xs text-muted-foreground">{label}</Text>
      <Text className="text-sm font-medium text-foreground">{value}</Text>
    </View>
  );
}

function AuditoriaDetalhe({ id }: { id: string }) {
  const { data: log, isLoading, isError, refetch } = useAuditoria(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-6">
        <ActivityIndicator />
        <Text className="text-muted-foreground">Carregando registro...</Text>
      </View>
    );
  }

  if (isError || !log) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-6">
        <Text className="text-xl font-semibold">Registro não encontrado</Text>
        <Text className="text-center text-muted-foreground">
          Não foi possível carregar este registro de auditoria.
        </Text>
        <View className="flex-row gap-2">
          <Button variant="outline" onPress={() => refetch()}>
            <Text>Tentar novamente</Text>
          </Button>
          <Button variant="outline" onPress={() => router.back()}>
            <Text>Voltar</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-4 pb-10">
      <View className="mx-auto w-full max-w-3xl gap-4">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Text className="text-2xl font-bold">Detalhe da auditoria</Text>
            <Text className="text-sm text-muted-foreground">
              {formatDateTime(log.createdAt)}
            </Text>
          </View>
          <Button variant="outline" onPress={() => router.back()}>
            <Text>Voltar</Text>
          </Button>
        </View>

        <Card>
          <CardHeader className="flex-row items-start justify-between gap-3">
            <CardTitle className="flex-1 text-base">
              {ENTIDADE_LABELS[log.entidade] ?? log.entidade}
            </CardTitle>
            <Badge variant={getActionVariant(log.acao)}>
              <Text>{ACAO_LABELS[log.acao]}</Text>
            </Badge>
          </CardHeader>
          <CardContent className="gap-3">
            <Campo label="Usuário" value={log.usuario?.nome ?? "Sistema"} />
            {log.usuario?.email ? (
              <Campo label="E-mail" value={log.usuario.email} />
            ) : null}
            {log.usuario?.perfil ? (
              <Campo label="Perfil" value={log.usuario.perfil} />
            ) : null}
            <Campo label="ID da entidade" value={log.entidadeId} />
            <Campo label="ID do registro" value={log.id} />
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}

export default function AuditoriaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);

  if (!user) return <Redirect href="/(auth)/login" />;
  if (!["ADMIN", "GESTOR"].includes(user.perfil)) return <Redirect href="/403" />;

  return <AuditoriaDetalhe id={id} />;
}
