import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, View, type ScrollViewInstance } from "react-native";
import { FileText, Plus } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useSendChatMessage } from "@/features/assistente/assistente.hooks";
import type { ChatViewMessage } from "@/features/assistente/assistente.types";
import {
  extractGeneratedReport,
  extractQueryBlocks,
} from "@/features/assistente/assistente.utils";
import { ChatEmptyState } from "@/features/assistente/components/chat-empty-state";
import { ChatInputBar } from "@/features/assistente/components/chat-input-bar";
import {
  AssistantMessage,
  ChatTypingIndicator,
  UserMessage,
} from "@/features/assistente/components/chat-messages";
import { useSelectedEmpresaId } from "@/hooks/use-selected-empresa";

function errorMessageOf(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data;
    if (
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string"
    ) {
      return data.error;
    }
  }

  return "Não foi possível enviar a mensagem. Tente novamente.";
}

export default function AssistenteScreen() {
  const empresaId = useSelectedEmpresaId();
  const mutation = useSendChatMessage();
  const { reset: resetMutation } = mutation;
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [conversationId, setConversationId] = useState<string>();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatViewMessage[]>([]);
  const [error, setError] = useState<string>();

  function resetConversation() {
    setConversationId(undefined);
    setMessages([]);
    setInput("");
    setError(undefined);
    resetMutation();
  }

  useEffect(() => {
    setConversationId(undefined);
    setMessages([]);
    setInput("");
    setError(undefined);
    resetMutation();
  }, [empresaId, resetMutation]);

  async function submitPrompt(rawText: string) {
    const message = rawText.trim();
    if (!message || mutation.isPending || !empresaId) return;

    const userMessage: ChatViewMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
    };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError(undefined);

    try {
      const response = await mutation.mutateAsync({
        message,
        ...(conversationId ? { conversationId } : {}),
      });
      setConversationId(response.conversationId);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${response.conversationId}-${Date.now()}`,
          role: "assistant",
          content: response.message,
          status: response.status,
          intent: response.intent,
          queryBlocks: extractQueryBlocks(response),
          report: extractGeneratedReport(response),
        },
      ]);
    } catch (requestError) {
      setError(errorMessageOf(requestError));
    }
  }

  const isInputDisabled = mutation.isPending || !empresaId;
  const canSend = Boolean(input.trim()) && !isInputDisabled;

  return (
    <View className="min-h-0 flex-1 bg-background px-4 py-4 lg:px-8 lg:py-6">
      <View className="mx-auto min-h-0 w-full max-w-6xl flex-1 gap-3 lg:gap-4">
        <View className="flex-row items-center justify-between gap-4">
          <View className="min-w-0 flex-1 gap-0.5">
            <Text className="text-xl font-bold text-foreground lg:text-2xl">
              Assistente
            </Text>
            <Text className="text-xs text-muted-foreground lg:text-sm">
              Consulte os dados de manutenção da empresa selecionada.
            </Text>
          </View>
          <View className="flex-row flex-wrap justify-end gap-2">
            <Button
              accessibilityLabel="Abrir relatórios"
              variant="outline"
              onPress={() => router.push("/relatorios")}
            >
              <Icon as={FileText} size={16} className="text-foreground" />
              <Text>Relatórios</Text>
            </Button>
            <Button variant="outline" onPress={resetConversation}>
              <Icon as={Plus} size={16} className="text-foreground" />
              <Text>Nova conversa</Text>
            </Button>
          </View>
        </View>

        <Card className="min-h-0 flex-1 overflow-hidden py-0">
          <CardContent className="min-h-0 flex-1 px-0 py-0">
            <ScrollView
              ref={scrollRef}
              className="min-h-0 flex-1"
              contentContainerClassName="flex-grow gap-3 px-4 py-4 lg:px-6"
              onContentSizeChange={() =>
                scrollRef.current?.scrollToEnd({ animated: true })
              }
            >
              {messages.length === 0 ? (
                <ChatEmptyState
                  disabled={isInputDisabled}
                  onSelectPrompt={submitPrompt}
                />
              ) : (
                messages.map((message) =>
                  message.role === "user" ? (
                    <UserMessage key={message.id} message={message} />
                  ) : (
                    <AssistantMessage key={message.id} message={message} />
                  ),
                )
              )}

              {mutation.isPending ? <ChatTypingIndicator /> : null}
            </ScrollView>
          </CardContent>
        </Card>

        {error ? (
          <View className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2">
            <Text className="text-sm text-destructive">{error}</Text>
          </View>
        ) : null}

        {!empresaId ? (
          <Text className="text-sm text-destructive">
            Selecione uma empresa antes de iniciar a conversa.
          </Text>
        ) : null}

        <ChatInputBar
          value={input}
          disabled={isInputDisabled}
          canSend={canSend}
          onChangeText={setInput}
          onSend={() => submitPrompt(input)}
        />
      </View>
    </View>
  );
}
