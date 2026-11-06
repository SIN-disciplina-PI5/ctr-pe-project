import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Send, Sparkles } from "lucide-react-native";

import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAssistente } from "@/features/ai/ai.hooks";

type Mensagem = {
  id: string;
  autor: "user" | "assistente";
  texto: string;
};

const SUGESTOES = [
  "Quantas máquinas estão paradas?",
  "Qual o custo total de manutenção?",
  "Quantas ordens de serviço estão abertas?",
];

function gerarId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function AssistenteScreen() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const assistente = useAssistente();
  const scrollRef = useRef<ScrollView>(null);

  // Rola para a última mensagem sempre que a conversa muda.
  useEffect(() => {
    const timer = setTimeout(
      () => scrollRef.current?.scrollToEnd({ animated: true }),
      80,
    );
    return () => clearTimeout(timer);
  }, [mensagens, assistente.isPending]);

  function enviar(pergunta: string) {
    const limpa = pergunta.trim();
    if (limpa.length < 3 || assistente.isPending) return;

    setTexto("");
    setMensagens((atual) => [
      ...atual,
      { id: gerarId(), autor: "user", texto: limpa },
    ]);

    assistente.mutate(limpa, {
      onSuccess: (resposta) => {
        const conteudo =
          resposta.status === "answered" ? resposta.answer : resposta.reason;
        setMensagens((atual) => [
          ...atual,
          { id: gerarId(), autor: "assistente", texto: conteudo },
        ]);
      },
      onError: () => {
        setMensagens((atual) => [
          ...atual,
          {
            id: gerarId(),
            autor: "assistente",
            texto: "Tive um problema ao consultar os dados. Tente novamente.",
          },
        ]);
      },
    });
  }

  const conversaVazia = mensagens.length === 0;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="mx-auto w-full max-w-3xl flex-1">
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName="gap-3 px-4 py-6"
        >
          {conversaVazia ? (
            <View className="items-center gap-3 px-2 py-10">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Icon as={Sparkles} size={26} className="text-primary" />
              </View>
              <Text className="text-xl font-bold text-foreground">
                Assistente de dados
              </Text>
              <Text className="text-center text-sm text-muted-foreground">
                Pergunte sobre a operação de manutenção e eu respondo com base
                nos dados do sistema.
              </Text>

              <View className="mt-2 w-full gap-2">
                {SUGESTOES.map((sugestao) => (
                  <Pressable
                    key={sugestao}
                    onPress={() => enviar(sugestao)}
                    className="rounded-xl border border-border bg-card px-4 py-3"
                  >
                    <Text className="text-sm text-foreground">{sugestao}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            mensagens.map((mensagem) => (
              <View
                key={mensagem.id}
                className={
                  mensagem.autor === "user" ? "items-end" : "items-start"
                }
              >
                <View
                  className={
                    mensagem.autor === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3"
                  }
                >
                  <Text
                    className={
                      mensagem.autor === "user"
                        ? "text-sm text-primary-foreground"
                        : "text-sm text-foreground"
                    }
                  >
                    {mensagem.texto}
                  </Text>
                </View>
              </View>
            ))
          )}

          {assistente.isPending ? (
            <View className="items-start">
              <View className="flex-row items-center gap-2 rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3">
                <ActivityIndicator size="small" />
                <Text className="text-sm text-muted-foreground">
                  Consultando os dados...
                </Text>
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View className="flex-row items-center gap-2 border-t border-border bg-background px-4 py-3">
          <Input
            className="flex-1"
            placeholder="Escreva sua pergunta..."
            value={texto}
            onChangeText={setTexto}
            onSubmitEditing={() => enviar(texto)}
            returnKeyType="send"
            editable={!assistente.isPending}
          />
          <Pressable
            onPress={() => enviar(texto)}
            disabled={assistente.isPending || texto.trim().length < 3}
            className="h-10 w-10 items-center justify-center rounded-md bg-primary disabled:opacity-50"
          >
            <Icon as={Send} size={18} className="text-primary-foreground" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}