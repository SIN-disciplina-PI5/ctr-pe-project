import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useParada } from "@/features/paradas/paradas.hooks";
import { ModalEncerrarParada } from "@/features/paradas/modal-encerrar-parada";
import { ModalCancelarParada } from "@/features/paradas/modal-cancelar-parada";
import { RoleGate } from "@/components/domain/role-gate";
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="mb-3">
      <Text className="text-muted-foreground text-xs mb-0.5">{label}</Text>
      <Text className="text-foreground text-sm">{value}</Text>
    </View>
  );
}

export default function ParadaDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: parada, isLoading, isError } = useParada(id);
  const [encerrarId, setEncerrarId] = useState<string | null>(null);
  const [cancelarId, setCancelarId] = useState<string | null>(null);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Carregando...</Text>
      </View>
    );
  }

  if (isError || !parada) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-destructive">Erro ao carregar parada.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-foreground text-xl font-bold">Detalhe da parada</Text>
          <View className={`px-3 py-1 rounded-full ${STATUS_COLORS[parada.status]}`}>
            <Text className={`text-xs font-medium ${STATUS_TEXT_COLORS[parada.status]}`}>
              {STATUS_LABELS[parada.status]}
            </Text>
          </View>
        </View>

        <View className="bg-card border border-border rounded-xl p-4 mb-4">
          <Text className="text-foreground font-semibold mb-3">Informações gerais</Text>

          <InfoRow label="Início" value={formatDate(parada.inicioEm)} />
          {parada.fimEm && <InfoRow label="Fim" value={formatDate(parada.fimEm)} />}
          {parada.duracaoMinutos != null && (
            <InfoRow label="Duração" value={`${parada.duracaoMinutos} minutos`} />
          )}
          {parada.motivo && <InfoRow label="Motivo" value={parada.motivo} />}
          <InfoRow label="Programada" value={parada.programada ? "Sim" : "Não"} />
          <InfoRow
            label="Impacta disponibilidade"
            value={parada.impactaDisponibilidade ? "Sim" : "Não"}
          />
        </View>

        <View className="bg-card border border-border rounded-xl p-4 mb-4">
          <Text className="text-foreground font-semibold mb-3">Vínculos</Text>
          <Pressable onPress={() => router.push(`/(protected)/ativos/${parada.ativoId}`)}>
            <Text className="text-primary text-sm mb-2">Ver ativo →</Text>
          </Pressable>
          {parada.ordemServicoId && (
            <Pressable
              onPress={() =>
                router.push(`/(protected)/ordens-servico/${parada.ordemServicoId}`)
              }
            >
              <Text className="text-primary text-sm">Ver ordem de serviço →</Text>
            </Pressable>
          )}
        </View>

        <RoleGate perfis={["ADMIN", "SUPERVISOR"]}>
          {parada.status === "ABERTA" && (
            <View className="gap-3">
              <Pressable
                onPress={() => setEncerrarId(parada.id)}
                className="bg-primary py-3 rounded-md items-center"
              >
                <Text className="text-primary-foreground font-semibold">Encerrar parada</Text>
              </Pressable>
              <Pressable
                onPress={() => setCancelarId(parada.id)}
                className="border border-destructive py-3 rounded-md items-center"
              >
                <Text className="text-destructive font-semibold">Cancelar parada</Text>
              </Pressable>
            </View>
          )}
        </RoleGate>
      </View>

      <ModalEncerrarParada
        paradaId={encerrarId}
        onClose={() => setEncerrarId(null)}
      />
      <ModalCancelarParada
        paradaId={cancelarId}
        onClose={() => setCancelarId(null)}
      />
    </ScrollView>
  );
}