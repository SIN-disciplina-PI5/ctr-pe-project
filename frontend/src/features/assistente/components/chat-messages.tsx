import { useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Bot, ChevronDown, ChevronUp } from "lucide-react-native";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import type { ChatViewMessage } from "@/features/assistente/assistente.types";
import {
  GeneratedReportView,
  QueryTable,
} from "@/features/assistente/components/chat-data-views";

export function AssistantMessage({ message }: { message: ChatViewMessage }) {
  const [showSql, setShowSql] = useState(false);
  const blocks = message.queryBlocks ?? [];

  return (
    <View className="max-w-[92%] self-start gap-3 rounded-xl border border-border bg-card px-4 py-3 lg:max-w-[82%]">
      <View className="flex-row items-center gap-2">
        <Icon as={Bot} size={16} className="text-primary" />
        <Text className="text-xs font-semibold text-muted-foreground">
          Assistente
        </Text>
      </View>
      <Text className="text-sm leading-5 text-foreground">
        {message.content}
      </Text>

      {blocks.map((block) => (
        <QueryTable key={block.id} block={block} />
      ))}

      {message.report ? <GeneratedReportView report={message.report} /> : null}

      {blocks.length > 0 ? (
        <View className="gap-2">
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowSql((value) => !value)}
            className="flex-row items-center gap-2 self-start"
          >
            <Icon
              as={showSql ? ChevronUp : ChevronDown}
              size={14}
              className="text-muted-foreground"
            />
            <Text className="text-xs font-medium text-muted-foreground">
              {showSql ? "Ocultar SQL" : "Visualizar SQL"}
            </Text>
          </Pressable>
          {showSql
            ? blocks.map((block) => (
                <View key={block.id} className="rounded-md bg-muted px-3 py-2">
                  <Text
                    selectable
                    className="font-mono text-xs text-foreground"
                  >
                    {block.sql}
                  </Text>
                </View>
              ))
            : null}
        </View>
      ) : null}
    </View>
  );
}

export function UserMessage({ message }: { message: ChatViewMessage }) {
  return (
    <View className="max-w-[85%] self-end rounded-xl bg-primary px-4 py-3 lg:max-w-[72%]">
      <Text className="text-sm leading-5 text-primary-foreground">
        {message.content}
      </Text>
    </View>
  );
}

export function ChatTypingIndicator() {
  return (
    <View className="flex-row items-center gap-2 self-start rounded-xl border border-border bg-card px-4 py-3">
      <ActivityIndicator size="small" />
      <Text className="text-sm text-muted-foreground">Analisando...</Text>
    </View>
  );
}
