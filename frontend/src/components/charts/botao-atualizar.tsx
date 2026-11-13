import { ActivityIndicator, Pressable, View } from "react-native";
import { RefreshCw } from "lucide-react-native";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type BotaoAtualizarProps = {
  onPress: () => void;
  carregando?: boolean;
  atualizadoEm?: Date | null;
};

// Botão "Atualizar" com a hora da última atualização.
export function BotaoAtualizar({
  onPress,
  carregando = false,
  atualizadoEm,
}: BotaoAtualizarProps) {
  const hora = atualizadoEm
    ? atualizadoEm.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <View className="flex-row items-center gap-3">
      {hora ? (
        <Text className="text-xs text-muted-foreground">Atualizado às {hora}</Text>
      ) : null}
      <Pressable
        onPress={onPress}
        disabled={carregando}
        className="h-9 flex-row items-center gap-2 rounded-md border border-border bg-card px-3 disabled:opacity-50"
      >
        {carregando ? (
          <ActivityIndicator size="small" />
        ) : (
          <Icon as={RefreshCw} size={14} className="text-foreground" />
        )}
        <Text className="text-sm font-medium text-foreground">Atualizar</Text>
      </Pressable>
    </View>
  );
}