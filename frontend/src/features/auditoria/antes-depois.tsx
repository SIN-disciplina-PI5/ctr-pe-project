import { FileX } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { calcularDiferencas } from "./auditoria.diff";

type AntesDepoisProps = {
  antes: unknown;
  depois: unknown;
};

export function AntesDepois({ antes, depois }: AntesDepoisProps) {
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const diferencas = calcularDiferencas(antes, depois);
  const alterados = diferencas.filter((item) => item.mudou);
  const linhas = mostrarTodos ? diferencas : alterados;

  if (diferencas.length === 0) {
    return (
      <EmptyState
        icon={FileX}
        title="Sem dados registrados"
        description="Este evento não guardou valores de antes e depois."
      />
    );
  }

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-sm text-muted-foreground">
          {alterados.length} de {diferencas.length} campos alterados
        </Text>
        {alterados.length !== diferencas.length ? (
          <Button variant="outline" size="sm" onPress={() => setMostrarTodos((v) => !v)}>
            <Text>{mostrarTodos ? "Só alterados" : "Mostrar todos"}</Text>
          </Button>
        ) : null}
      </View>

      <View className="flex-row gap-3 border-b border-border pb-2">
        <Text className="w-28 text-xs font-semibold text-muted-foreground">Campo</Text>
        <Text className="flex-1 text-xs font-semibold text-muted-foreground">Antes</Text>
        <Text className="flex-1 text-xs font-semibold text-muted-foreground">Depois</Text>
      </View>

      {linhas.map((item) => (
        <View
          key={item.campo}
          className={
            item.mudou
              ? "flex-row gap-3 rounded-md bg-muted/60 px-2 py-2"
              : "flex-row gap-3 px-2 py-2"
          }
        >
          <Text className="w-28 text-sm font-medium" numberOfLines={2}>
            {item.campo}
          </Text>
          <Text
            className={
              item.mudou
                ? "flex-1 text-sm text-muted-foreground line-through"
                : "flex-1 text-sm text-muted-foreground"
            }
          >
            {item.antes}
          </Text>
          <Text className={item.mudou ? "flex-1 text-sm font-semibold" : "flex-1 text-sm"}>
            {item.depois}
          </Text>
        </View>
      ))}
    </View>
  );
}
