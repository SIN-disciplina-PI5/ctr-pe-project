import { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useParadas } from "@/features/paradas/paradas.hooks";
import { useEmpresaStore } from "@/store/empresa-store";
import { RoleGate } from "@/components/domain/role-gate";
import { ModalEncerrarParada } from "@/features/paradas/modal-encerrar-parada";
import { ModalCancelarParada } from "@/features/paradas/modal-cancelar-parada";
import { ParadasFiltros } from "@/features/paradas/paradas-filtros";
import type { StatusParada } from "@/features/paradas/paradas.types";

const STATUS_LABELS: Record<StatusParada, string> = {
  ABERTA: "Aberta",
  ENCERRADA: "Encerrada",
  CANCELADA: "Cancelada",
};

const STATUS_COLORS: Record<StatusParada, string> = {
  ABERTA: "bg-yellow-100",
  ENCERRADA: "bg-green-100",
  CANCELADA: "bg-muted",
};

const STATUS_TEXT_COLORS: Record<StatusParada, string> = {
  ABERTA: "text-yellow-700",
  ENCERRADA: "text-green-700",
  CANCELADA: "text-muted-foreground",
};

export default function ParadasScreen() {
  const router = useRouter();
  const { empresaId } = useEmpresaStore();
  const [statusFiltro, setStatusFiltro] = useState<StatusParada | undefined>(undefined);
  const [encerrarId, setEncerrarId] = useState<string | null>(null);
  const [cancelarId, setCancelarId] = useState<string | null>(null);

  const { data: paradas, isLoading, isError } = useParadas({
    empresaId: empresaId ?? undefined,
    status: statusFiltro,
  });

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <View className="flex-1 bg-background p-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-foreground text-xl font-bold">Paradas</Text>
        <RoleGate perfis={["ADMIN", "SUPERVISOR"]}>
          <Pressable
            onPress={() => router.push("/(protected)/paradas/nova")}
            className="bg-primary px-4 py-2 rounded-md"
          >
            <Text className="text-primary-foreground text-sm font-medium">Nova parada</Text>
          </Pressable>
        </RoleGate>
      </View>

      <ParadasFiltros status={statusFiltro} onStatusChange={setStatusFiltro} />

      {isLoading && <Text className="text-muted-foreground text-center">Carregando...</Text>}
      {isError && <Text className="text-destructive text-center">Erro ao carregar paradas.</Text>}

      <FlatList
        data={paradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-card border border-border rounded-lg p-4 mb-3">
            <View className="flex-row items-center justify-between mb-2">
              <View className={`px-2 py-0.5 rounded-full ${STATUS_COLORS[item.status]}`}>
                <Text className={`text-xs font-medium ${STATUS_TEXT_COLORS[item.status]}`}>
                  {STATUS_LABELS[item.status]}
                </Text>
              </View>
              {item.programada && (
                <View className="bg-blue-100 px-2 py-0.5 rounded-full">
                  <Text className="text-blue-700 text-xs">Programada</Text>
                </View>
              )}
            </View>

            <Text className="text-foreground text-sm mb-1">
              Início: {formatDate(item.inicioEm)}
            </Text>
            {item.fimEm && (
              <Text className="text-foreground text-sm mb-1">
                Fim: {formatDate(item.fimEm)}
              </Text>
            )}
            {item.duracaoMinutos != null && (
              <Text className="text-muted-foreground text-sm mb-1">
                Duração: {item.duracaoMinutos} min
              </Text>
            )}
            {item.motivo && (
              <Text className="text-muted-foreground text-sm mb-1">
                Motivo: {item.motivo}
              </Text>
            )}

            <View className="flex-row gap-3 mt-2">
              <Pressable onPress={() => router.push(`/(protected)/paradas/${item.id}`)}>
                <Text className="text-primary text-sm">Detalhes</Text>
              </Pressable>
              <RoleGate perfis={["ADMIN", "SUPERVISOR"]}>
                {item.status === "ABERTA" && (
                  <>
                    <Pressable onPress={() => setEncerrarId(item.id)}>
                      <Text className="text-primary text-sm">Encerrar</Text>
                    </Pressable>
                    <Pressable onPress={() => setCancelarId(item.id)}>
                      <Text className="text-destructive text-sm">Cancelar</Text>
                    </Pressable>
                  </>
                )}
              </RoleGate>
            </View>
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <Text className="text-muted-foreground text-center mt-8">Nenhuma parada encontrada.</Text>
          ) : null
        }
      />

      <ModalEncerrarParada paradaId={encerrarId} onClose={() => setEncerrarId(null)} />
      <ModalCancelarParada paradaId={cancelarId} onClose={() => setCancelarId(null)} />
    </View>
  );
}