import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

import { OrdemServicoCard } from "@/components/domain/ordem-servico-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { STATUS_OS_LABEL } from "@/constants/status";
import { useOrdensServico } from "@/features/ordens-servico/ordens-servico.hooks";
import type { OrdensServicoFilters } from "@/features/ordens-servico/ordens-servico.schemas";
import { useSelectedEmpresaId } from "@/hooks/use-selected-empresa";
import type { StatusOS } from "@/types/ordem-servico";

const STATUS_FILTERS: { value: StatusOS | "TODOS"; label: string }[] = [
  { value: "TODOS", label: "Todas" },
  { value: "ABERTA", label: STATUS_OS_LABEL.ABERTA },
  { value: "EM_EXECUCAO", label: STATUS_OS_LABEL.EM_EXECUCAO },
  { value: "AGUARDANDO_PECA", label: STATUS_OS_LABEL.AGUARDANDO_PECA },
  { value: "ENCERRADA", label: STATUS_OS_LABEL.ENCERRADA },
  { value: "CANCELADA", label: STATUS_OS_LABEL.CANCELADA },
];

export default function OrdensServicoScreen() {
  const router = useRouter();
  const empresaId = useSelectedEmpresaId();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusOS | "TODOS">("TODOS");

  const filters = useMemo<OrdensServicoFilters>(() => {
    return {
      ...(empresaId ? { empresaId } : {}),
      ...(status !== "TODOS" ? { status } : {}),
      ...(search.trim() ? { search: search.trim() } : {}),
    };
  }, [empresaId, status, search]);

  const { data, isLoading, isError, refetch, isRefetching } =
    useOrdensServico(filters);

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between gap-2 pb-3">
        <Text variant="h4">Ordens de Serviço</Text>
        <Button size="sm" onPress={() => router.push("/ordens-servico/nova")}>
          <Text>Nova</Text>
        </Button>
      </View>

      <Input
        placeholder="Buscar por número, título…"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />

      <View className="flex-row flex-wrap gap-2 py-3">
        {STATUS_FILTERS.map((item) => (
          <Pressable
            key={item.value}
            onPress={() => setStatus(item.value)}
            className={
              status === item.value
                ? "rounded-full bg-primary px-3 py-1"
                : "rounded-full border border-border bg-background px-3 py-1"
            }
          >
            <Text
              variant="small"
              className={
                status === item.value ? "text-primary-foreground" : "text-foreground"
              }
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <Text variant="muted">Não foi possível carregar as ordens de serviço.</Text>
          <Button variant="outline" size="sm" onPress={() => refetch()}>
            <Text>Tentar novamente</Text>
          </Button>
        </View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshing={isRefetching}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <OrdemServicoCard
              ordemServico={item}
              onPress={() => router.push(`/ordens-servico/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <View className="items-center justify-center py-16">
              <Text variant="muted">Nenhuma ordem de serviço encontrada.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
