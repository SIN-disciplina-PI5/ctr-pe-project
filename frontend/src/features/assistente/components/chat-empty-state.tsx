import { Pressable, View } from "react-native";
import { Bot, Sparkles } from "lucide-react-native";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

const QUICK_PROMPTS = [
  "Quais ordens de serviço foram abertas hoje?",
  "Mostre os ativos com maior tempo de parada este mês.",
  "Qual o custo total de manutenção preventiva no último trimestre?",
  "Liste os materiais com estoque abaixo do mínimo.",
];

export function ChatEmptyState({
  disabled,
  onSelectPrompt,
}: {
  disabled: boolean;
  onSelectPrompt: (prompt: string) => void;
}) {
  return (
    <View className="flex-1 items-center justify-center gap-5 px-4 py-10">
      <View className="items-center gap-2">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Icon as={Bot} size={24} className="text-primary" />
        </View>
        <Text className="text-center text-base font-semibold text-foreground">
          Como posso ajudar com a manutenção?
        </Text>
        <Text className="max-w-xl text-center text-sm text-muted-foreground">
          Pergunte sobre ativos, ordens de serviço, paradas, materiais ou
          custos.
        </Text>
      </View>

      <View className="w-full max-w-2xl flex-row flex-wrap justify-center gap-2">
        {QUICK_PROMPTS.map((prompt) => (
          <Pressable
            key={prompt}
            accessibilityRole="button"
            disabled={disabled}
            onPress={() => onSelectPrompt(prompt)}
            className="w-full flex-row items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2.5 active:bg-muted md:w-[48%]"
          >
            <Icon as={Sparkles} size={14} className="shrink-0 text-primary" />
            <Text className="flex-1 text-xs leading-4 text-foreground">
              {prompt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
