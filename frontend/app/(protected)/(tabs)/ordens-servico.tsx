import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

import { PrioridadeBadge } from "@/components/domain/prioridade-badge";
import { StatusBadge } from "@/components/domain/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { TIPO_OS_LABEL } from "@/constants/status";
import { useOrdensServico } from "@/features/ordens-servico/ordens-servico.hooks";
import { useSelectedEmpresaId } from "@/hooks/use-selected-empresa";
import { formatDateTime } from "@/lib/dates";
import type { OrdemServico } from "@/types/ordem-servico";

function OrdemServicoCard({ ordem }: { ordem: OrdemServico }) {
  return (
    <Pressable onPress={() => router.push(`/ordens-servico/${ordem.id}`)}>
      <Card>
        <CardContent className="gap-3 p-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="text-xs text-muted-foreground">{ordem.numero}</Text>
              <Text className="text-base font-semibold text-foreground">
                {ordem.titulo}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {ordem.ativo
                  ? `${ordem.ativo.codigo} · ${ordem.ativo.nome}`
                  : "Ativo não informado"}
              </Text>
            </View>

            <StatusBadge status={ordem.status} />
          </View>

          <View className="flex-row flex-wrap gap-2">
            <PrioridadeBadge prioridade={ordem.prioridade} />
            <Text className="text-sm text-muted-foreground">
              {TIPO_OS_LABEL[ordem.tipo]}
            </Text>
          </View>

          <View className="gap-1">
            <Text className="text-sm text-muted-foreground">
              Responsável: {ordem.responsavel?.nome ?? "Não definido"}
            </Text>
            <Text className="text-sm text-muted-foreground">
              Prazo: {formatDateTime(ordem.prazoEm) ?? "Não definido"}
            </Text>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}

export default function OrdensServicoScreen() {
  const empresaId = useSelectedEmpresaId();
  const [search, setSearch] = useState("");

  const filters = useMemo(
    () => ({
      empresaId: empresaId ?? undefined,
      search: search || undefined,
    }),
    [empresaId, search],
  );

  const {
    data: ordens,
    isLoading,
    isError,
    refetch,
  } = useOrdensServico(filters);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <ActivityIndicator />
        <Text className="mt-3 text-muted-foreground">
          Carregando ordens de serviço...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-xl font-semibold">
          Erro ao carregar ordens de serviço
        </Text>
        <Text className="mt-2 text-center text-muted-foreground">
          Não foi possível buscar as ordens cadastradas.
        </Text>
        <Button className="mt-4" onPress={() => refetch()}>
          <Text>Tentar novamente</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 py-6">
      <View className="mb-4 flex-row items-center justify-between gap-4">
        <View className="flex-1">
          <Text className="text-2xl font-bold">Ordens de Serviço</Text>
          <Text className="text-sm text-muted-foreground">
            Acompanhe as ordens abertas, em execução e encerradas.
          </Text>
        </View>

        <Button onPress={() => router.push("/ordens-servico/nova")}>
          <Text>Nova</Text>
        </Button>
      </View>

      <View className="mb-4">
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por número, título ou ativo..."
        />
      </View>

      <FlatList
        data={ordens ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3 pb-8"
        renderItem={({ item }) => <OrdemServicoCard ordem={item} />}
        ListEmptyComponent={
          <View className="items-center justify-center rounded-xl border border-dashed border-border p-8">
            <Text className="text-lg font-semibold">
              Nenhuma ordem de serviço encontrada
            </Text>
            <Text className="mt-2 text-center text-muted-foreground">
              Crie a primeira ordem para começar.
            </Text>
          </View>
        }
      />
    </View>
  );
}