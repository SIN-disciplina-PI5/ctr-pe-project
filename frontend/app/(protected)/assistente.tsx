import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Check, Copy, Plus, Send, Sparkles } from "lucide-react-native";

import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAssistente } from "@/features/ai/ai.hooks";
import {
  useAssistenteStore,
  type MensagemAssistente,
} from "@/store/assistente-store";

const SUGESTOES = [
  "Quantas máquinas estão paradas?",
  "Qual o custo total de manutenção?",
  "Quantas ordens de serviço estão abertas?",
  "Quais materiais estão com estoque crítico?",
];

const AVISO_RECUSA =
  "Tente perguntar sobre ativos, ordens de serviço, custos ou materiais.";

function gerarId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function AssistenteScreen() {
  const mensagens = useAssistenteStore((estado) => estado.mensagens);
  const adicionar = useAssistenteStore((estado) => estado.adicionar);
  const limpar = useAssistenteStore((estado) => estado.limpar);

  const [texto, setTexto] = useState("");
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
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
    adicionar({ id: gerarId(), autor: "user", texto: limpa });

    assistente.mutate(limpa, {
      onSuccess: (resposta) => {
        if (resposta.status === "answered") {
          adicionar({ id: gerarId(), autor: "assistente", texto: resposta.answer });
          return;
        }
        adicionar({
          id: gerarId(),
          autor: "assistente",
          texto: `Não consegui responder a essa pergunta. ${resposta.reason}\n\n${AVISO_RECUSA}`,
          recusada: true,
        });
      },
      onError: () => {
        adicionar({
          id: gerarId(),
          autor: "assistente",
          texto: "Tive um problema ao consultar os dados. Tente novamente.",
          recusada: true,
        });
      },
    });
  }

  // Copiar só está disponível na web (no celular exigiria outra biblioteca).
  const areaTransferencia =
    Platform.OS === "web" ? (globalThis as any).navigator?.clipboard : null;

  function copiar(mensagem: MensagemAssistente) {
    if (!areaTransferencia) return;
    areaTransferencia.writeText(mensagem.texto).then(() => {
      setCopiadoId(mensagem.id);
      setTimeout(() => setCopiadoId(null), 1500);
    });
  }

  const conversaVazia = mensagens.length === 0;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="mx-auto w-full max-w-3xl flex-1">
        {!conversaVazia ? (
          <View className="flex-row items-center justify-between px-4 pt-4">
            <Text className="text-sm text-muted-foreground">
              {mensagens.length} mensagens
            </Text>
            <Pressable
              onPress={limpar}
              className="h-9 flex-row items-center gap-2 rounded-md border border-border bg-card px-3"
            >
              <Icon as={Plus} size={14} className="text-foreground" />
              <Text className="text-sm font-medium text-foreground">
                Nova conversa
              </Text>
            </Pressable>
          </View>
        ) : null}

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
            mensagens.map((mensagem) => {
              const doUsuario = mensagem.autor === "user";
              return (
                <View
                  key={mensagem.id}
                  className={doUsuario ? "items-end" : "items-start"}
                >
                  <View
                    className={
                      doUsuario
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3"
                        : mensagem.recusada
                          ? "max-w-[85%] gap-2 rounded-2xl rounded-bl-sm border border-amber-500/50 bg-amber-500/10 px-4 py-3"
                          : "max-w-[85%] gap-2 rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3"
                    }
                  >
                    <Text
                      className={
                        doUsuario
                          ? "text-sm text-primary-foreground"
                          : "text-sm text-foreground"
                      }
                    >
                      {mensagem.texto}
                    </Text>

                    {!doUsuario && !mensagem.recusada && areaTransferencia ? (
                      <Pressable
                        onPress={() => copiar(mensagem)}
                        className="flex-row items-center gap-1 self-start"
                      >
                        <Icon
                          as={copiadoId === mensagem.id ? Check : Copy}
                          size={12}
                          className="text-muted-foreground"
                        />
                        <Text className="text-xs text-muted-foreground">
                          {copiadoId === mensagem.id ? "Copiado" : "Copiar"}
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              );
            })
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