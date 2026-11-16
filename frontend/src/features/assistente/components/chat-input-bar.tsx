import {
  Platform,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from "react-native";
import { Send } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

export function ChatInputBar({
  value,
  disabled,
  canSend,
  onChangeText,
  onSend,
}: {
  value: string;
  disabled: boolean;
  canSend: boolean;
  onChangeText: (text: string) => void;
  onSend: () => void;
}) {
  function handleKeyPress(
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) {
    if (Platform.OS !== "web") return;
    const nativeEvent = event.nativeEvent as TextInputKeyPressEventData & {
      shiftKey?: boolean;
    };
    if (nativeEvent.key === "Enter" && !nativeEvent.shiftKey) {
      event.preventDefault();
      if (canSend) {
        onSend();
      }
    }
  }

  return (
    <View className="gap-1.5">
      <View className="flex-row items-end gap-2">
        <TextInput
          accessibilityLabel="Mensagem"
          multiline
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSend}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua pergunta..."
          placeholderTextColor="#6b7280"
          editable={!disabled}
          className="max-h-32 min-h-12 flex-1 rounded-md border border-input bg-background px-3 py-3 text-sm text-foreground"
        />
        <Button
          accessibilityLabel="Enviar mensagem"
          size="icon"
          disabled={!canSend}
          onPress={onSend}
        >
          <Icon as={Send} size={18} className="text-primary-foreground" />
        </Button>
      </View>
      {Platform.OS === "web" ? (
        <Text className="text-[11px] text-muted-foreground">
          Pressione Enter para enviar · Shift + Enter para quebrar linha
        </Text>
      ) : null}
    </View>
  );
}
