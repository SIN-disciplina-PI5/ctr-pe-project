import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import type { Ativo } from "@/features/ativos/ativos.types";

import { CriticidadeBadge } from "./criticidade-badge";
import { StatusBadge } from "./status-badge";

type AtivoCardProps = {
  ativo: Ativo;
  onPress?: () => void;
};

export function AtivoCard({ ativo, onPress }: AtivoCardProps) {
  return (
    <Pressable
      className="rounded-xl border border-border bg-card p-4"
      onPress={onPress}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold">{ativo.nome}</Text>
          <Text className="text-sm text-muted-foreground">Código: {ativo.codigo}</Text>
        </View>

        <StatusBadge status={ativo.status} />
      </View>

      <View className="mt-3 flex-row flex-wrap gap-2">
        <CriticidadeBadge criticidade={ativo.criticidade} />
        <Text className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
          {ativo.tipo}
        </Text>
      </View>

      {ativo.descricao ? (
        <Text className="mt-3 text-sm text-muted-foreground">{ativo.descricao}</Text>
      ) : null}
    </Pressable>
  );
}
