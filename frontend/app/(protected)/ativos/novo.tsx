import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useCreateAtivo } from "@/features/ativos/ativos.hooks";
import type { Criticidade, TipoAtivo } from "@/features/ativos/ativos.types";
import { useEmpresas } from "@/features/empresas/empresas.hooks";
import { useLocalizacoes } from "@/features/localizacoes/localizacoes.hooks";
import { useEmpresaStore } from "@/store/empresa-store";

const TIPOS: TipoAtivo[] = [
  "MAQUINA",
  "CAMINHAO",
  "EQUIPAMENTO",
  "COMPONENTE",
  "OUTRO",
];

const CRITICIDADES: Criticidade[] = ["BAIXA", "MEDIA", "ALTA", "CRITICA"];

export default function NovoAtivoScreen() {
  const createAtivo = useCreateAtivo();
  const { empresaId: empresaSelecionadaGlobal } = useEmpresaStore();
  const { data: empresas } = useEmpresas({ ativa: true });

  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [empresaId, setEmpresaId] = useState(empresaSelecionadaGlobal ?? "");
  const [localizacaoId, setLocalizacaoId] = useState("");
  const [tipo, setTipo] = useState<TipoAtivo>("MAQUINA");
  const [criticidade, setCriticidade] = useState<Criticidade>("MEDIA");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");

  const { data: localizacoes } = useLocalizacoes({
    empresaId: empresaId || undefined,
    ativa: true,
  });

  useEffect(() => {
    if (!empresaId && empresaSelecionadaGlobal) {
      setEmpresaId(empresaSelecionadaGlobal);
    }
  }, [empresaId, empresaSelecionadaGlobal]);

  useEffect(() => {
    setLocalizacaoId("");
  }, [empresaId]);

  const empresaAtual = useMemo(
    () => empresas?.find((item) => item.id === empresaId) ?? null,
    [empresas, empresaId],
  );

  async function handleSubmit() {
    await createAtivo.mutateAsync({
      empresaId,
      localizacaoId: localizacaoId || undefined,
      codigo,
      nome,
      tipo,
      criticidade,
      marca: marca || undefined,
      modelo: modelo || undefined,
      status: "DISPONIVEL",
    });

    router.back();
  }

  return (
    <ScrollView className="flex-1 bg-background px-4 py-6">
      <Text className="mb-6 text-2xl font-bold">Novo ativo</Text>

      <View className="gap-4">
        <View className="gap-2">
          <Text>Empresa</Text>
          <View className="gap-2">
            {empresas?.map((empresa) => (
              <Pressable
                key={empresa.id}
                onPress={() => setEmpresaId(empresa.id)}
                className={`rounded-md border px-3 py-2 ${
                  empresaId === empresa.id
                    ? "border-primary bg-primary"
                    : "border-border bg-card"
                }`}
              >
                <Text
                  className={
                    empresaId === empresa.id
                      ? "text-primary-foreground font-medium"
                      : "text-foreground font-medium"
                  }
                >
                  {empresa.nome}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="gap-2">
          <Text>Localização</Text>
          {!empresaId ? (
            <Text className="text-sm text-muted-foreground">
              Selecione uma empresa primeiro.
            </Text>
          ) : localizacoes?.length ? (
            <View className="gap-2">
              <Pressable
                onPress={() => setLocalizacaoId("")}
                className={`rounded-md border px-3 py-2 ${
                  localizacaoId === ""
                    ? "border-primary bg-primary"
                    : "border-border bg-card"
                }`}
              >
                <Text
                  className={
                    localizacaoId === ""
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }
                >
                  Sem localização
                </Text>
              </Pressable>

              {localizacoes.map((localizacao) => (
                <Pressable
                  key={localizacao.id}
                  onPress={() => setLocalizacaoId(localizacao.id)}
                  className={`rounded-md border px-3 py-2 ${
                    localizacaoId === localizacao.id
                      ? "border-primary bg-primary"
                      : "border-border bg-card"
                  }`}
                >
                  <Text
                    className={
                      localizacaoId === localizacao.id
                        ? "text-primary-foreground font-medium"
                        : "text-foreground font-medium"
                    }
                  >
                    {localizacao.codigo
                      ? `${localizacao.codigo} - ${localizacao.nome}`
                      : localizacao.nome}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text className="text-sm text-muted-foreground">
              Nenhuma localização cadastrada para {empresaAtual?.nome ?? "esta empresa"}.
            </Text>
          )}
        </View>

        <View className="gap-2">
          <Text>Código</Text>
          <Input value={codigo} onChangeText={setCodigo} placeholder="Ex: ATV-001" />
        </View>

        <View className="gap-2">
          <Text>Nome</Text>
          <Input value={nome} onChangeText={setNome} placeholder="Ex: Escavadeira 01" />
        </View>

        <View className="gap-2">
          <Text>Tipo</Text>
          <View className="flex-row flex-wrap gap-2">
            {TIPOS.map((item) => (
              <Pressable
                key={item}
                onPress={() => setTipo(item)}
                className={`rounded-md border px-3 py-2 ${
                  tipo === item ? "border-primary bg-primary" : "border-border bg-card"
                }`}
              >
                <Text
                  className={
                    tipo === item
                      ? "text-primary-foreground text-sm"
                      : "text-foreground text-sm"
                  }
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="gap-2">
          <Text>Criticidade</Text>
          <View className="flex-row flex-wrap gap-2">
            {CRITICIDADES.map((item) => (
              <Pressable
                key={item}
                onPress={() => setCriticidade(item)}
                className={`rounded-md border px-3 py-2 ${
                  criticidade === item
                    ? "border-primary bg-primary"
                    : "border-border bg-card"
                }`}
              >
                <Text
                  className={
                    criticidade === item
                      ? "text-primary-foreground text-sm"
                      : "text-foreground text-sm"
                  }
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="gap-2">
          <Text>Marca</Text>
          <Input value={marca} onChangeText={setMarca} placeholder="Ex: Caterpillar" />
        </View>

        <View className="gap-2">
          <Text>Modelo</Text>
          <Input value={modelo} onChangeText={setModelo} placeholder="Ex: 320D" />
        </View>

        <Button
          disabled={
            createAtivo.isPending || !empresaId || !codigo.trim() || !nome.trim()
          }
          onPress={handleSubmit}
        >
          <Text>{createAtivo.isPending ? "Salvando..." : "Salvar"}</Text>
        </Button>
      </View>
    </ScrollView>
  );
}