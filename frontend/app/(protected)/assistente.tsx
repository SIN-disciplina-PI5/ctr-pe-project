import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { Bot, ChevronDown, ChevronUp, Plus, Send } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useSendChatMessage } from "@/features/assistente/assistente.hooks";
import type {
  ChatViewMessage,
  GeneratedReport,
  QueryRow,
  QueryResultBlock,
} from "@/features/assistente/assistente.types";
import {
  extractGeneratedReport,
  extractQueryBlocks,
  formatCell,
} from "@/features/assistente/assistente.utils";
import { useSelectedEmpresaId } from "@/hooks/use-selected-empresa";

function DataTable({
  id,
  rows,
  columns: configuredColumns,
}: {
  id: string;
  rows: QueryRow[];
  columns?: string[];
}) {
  const columns = useMemo(
    () =>
      configuredColumns?.length
        ? configuredColumns
        : Array.from(new Set(rows.flatMap((row) => Object.keys(row)))),
    [configuredColumns, rows],
  );

  if (rows.length === 0) return null;

  return (
    <ScrollView horizontal className="rounded-md border border-border">
      <View>
        <View className="flex-row bg-muted">
          {columns.map((column) => (
            <View
              key={column}
              className="min-w-32 border-r border-border px-3 py-2"
            >
              <Text className="text-xs font-semibold text-foreground">
                {column}
              </Text>
            </View>
          ))}
        </View>
        {rows.map((row, rowIndex) => (
          <View
            key={`${id}-${rowIndex}`}
            className="flex-row border-t border-border"
          >
            {columns.map((column) => (
              <View
                key={column}
                className="min-w-32 border-r border-border px-3 py-2"
              >
                <Text className="text-xs text-foreground">
                  {formatCell(row[column])}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function QueryTable({ block }: { block: QueryResultBlock }) {
  return (
    <View className="gap-2">
      {block.purpose ? (
        <Text className="text-xs font-medium text-muted-foreground">
          {block.purpose}
        </Text>
      ) : null}
      <DataTable id={block.id} rows={block.rowsUsed} />
    </View>
  );
}

function GeneratedReportView({ report }: { report: GeneratedReport }) {
  return (
    <View className="gap-3 rounded-lg border border-border bg-background px-3 py-3">
      <Text className="font-semibold text-foreground">{report.title}</Text>
      {report.sections.map((section) => (
        <View key={section.id} className="gap-2">
          <Text className="text-sm font-semibold text-foreground">
            {section.title}
          </Text>
          <Text className="text-sm leading-5 text-muted-foreground">
            {section.narrative}
          </Text>
          {section.table ? (
            <DataTable
              id={`report-${section.id}`}
              rows={section.table.rows}
              columns={section.table.columns}
            />
          ) : null}
          {section.chart?.series.map((series) => (
            <View key={series.name} className="gap-1">
              <Text className="text-xs font-semibold text-muted-foreground">
                {series.name}
              </Text>
              {series.data.map((point) => (
                <View
                  key={`${series.name}-${point.label}`}
                  className="flex-row justify-between gap-4"
                >
                  <Text className="text-xs text-foreground">{point.label}</Text>
                  <Text className="text-xs font-medium text-foreground">
                    {formatCell(point.value)}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function AssistantMessage({ message }: { message: ChatViewMessage }) {
  const [showSql, setShowSql] = useState(false);
  const blocks = message.queryBlocks ?? [];

  return (
    <View className="max-w-[92%] self-start gap-3 rounded-xl border border-border bg-card px-4 py-3">
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

function UserMessage({ message }: { message: ChatViewMessage }) {
  return (
    <View className="max-w-[85%] self-end rounded-xl bg-primary px-4 py-3">
      <Text className="text-sm leading-5 text-primary-foreground">
        {message.content}
      </Text>
    </View>
  );
}

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
  const scrollRef = useRef<ScrollView>(null);
  const [conversationId, setConversationId] = useState<string>();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatViewMessage[]>([]);
  const [error, setError] = useState<string>();

  function newConversation() {
    setConversationId(undefined);
    setMessages([]);
    setInput("");
    setError(undefined);
    mutation.reset();
  }

  useEffect(() => {
    newConversation();
  }, [empresaId]);

  async function sendMessage() {
    const message = input.trim();
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

  return (
    <View className="flex-1 bg-background px-4 py-5">
      <View className="mx-auto w-full max-w-5xl flex-1 gap-4">
        <View className="flex-row items-center justify-between gap-4">
          <View className="min-w-0 flex-1 gap-1">
            <Text className="text-2xl font-bold text-foreground">
              Assistente
            </Text>
            <Text className="text-sm text-muted-foreground">
              Consulte os dados de manutenção da empresa selecionada.
            </Text>
          </View>
          <Button variant="outline" onPress={newConversation}>
            <Icon as={Plus} size={16} className="text-foreground" />
            <Text>Nova conversa</Text>
          </Button>
        </View>

        <Card className="min-h-0 flex-1 py-0">
          <CardContent className="min-h-0 flex-1 px-0 py-0">
            <ScrollView
              ref={scrollRef}
              className="flex-1"
              contentContainerClassName="gap-3 px-4 py-4"
              onContentSizeChange={() =>
                scrollRef.current?.scrollToEnd({ animated: true })
              }
            >
              {messages.length === 0 ? (
                <View className="items-center gap-3 px-6 py-16">
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon as={Bot} size={24} className="text-primary" />
                  </View>
                  <Text className="text-center font-semibold text-foreground">
                    Como posso ajudar com a manutenção?
                  </Text>
                  <Text className="max-w-xl text-center text-sm text-muted-foreground">
                    Pergunte sobre ativos, ordens de serviço, paradas, materiais
                    ou custos.
                  </Text>
                </View>
              ) : (
                messages.map((message) =>
                  message.role === "user" ? (
                    <UserMessage key={message.id} message={message} />
                  ) : (
                    <AssistantMessage key={message.id} message={message} />
                  ),
                )
              )}

              {mutation.isPending ? (
                <View className="flex-row items-center gap-2 self-start rounded-xl border border-border bg-card px-4 py-3">
                  <ActivityIndicator size="small" />
                  <Text className="text-sm text-muted-foreground">
                    Analisando...
                  </Text>
                </View>
              ) : null}
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

        <View className="flex-row items-end gap-2">
          <TextInput
            accessibilityLabel="Mensagem"
            multiline
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            placeholder="Digite sua pergunta..."
            placeholderTextColor="#6b7280"
            editable={!mutation.isPending && !!empresaId}
            className="max-h-32 min-h-12 flex-1 rounded-md border border-input bg-background px-3 py-3 text-sm text-foreground"
          />
          <Button
            accessibilityLabel="Enviar mensagem"
            size="icon"
            disabled={!input.trim() || mutation.isPending || !empresaId}
            onPress={sendMessage}
          >
            <Icon as={Send} size={18} className="text-primary-foreground" />
          </Button>
        </View>
      </View>
    </View>
  );
}
