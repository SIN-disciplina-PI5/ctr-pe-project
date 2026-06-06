import { View, Text, Pressable } from "react-native";
import { useEmpresas } from "@/features/empresas/empresas.hooks";
import { useEmpresaStore } from "@/store/empresa-store";

export function EmpresaSelector() {
  const { data: empresas } = useEmpresas({ ativa: true });
  const { empresaId, setEmpresaId } = useEmpresaStore();

  const selecionada = empresas?.find((empresa) => empresa.id === empresaId);

  return (
    <View className="gap-2">
      <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Empresa selecionada
      </Text>

      <View className="flex-row flex-wrap items-center gap-2">
        <Pressable
          onPress={() => setEmpresaId(null)}
          className={`px-3 py-2 rounded-md border ${
            empresaId === null
              ? "bg-primary border-primary"
              : "border-border bg-card"
          }`}
        >
          <Text
            className={
              empresaId === null
                ? "text-primary-foreground text-sm"
                : "text-foreground text-sm"
            }
          >
            Sem filtro
          </Text>
        </Pressable>

        {empresas?.map((empresa) => (
          <Pressable
            key={empresa.id}
            onPress={() => setEmpresaId(empresa.id)}
            className={`px-3 py-2 rounded-md border ${
              empresaId === empresa.id
                ? "bg-primary border-primary"
                : "border-border bg-card"
            }`}
          >
            <Text
              className={
                empresaId === empresa.id
                  ? "text-primary-foreground text-sm"
                  : "text-foreground text-sm"
              }
            >
              {empresa.nome}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text className="text-xs text-muted-foreground">
        {selecionada
          ? `Atual: ${selecionada.nome}`
          : "Sem filtro de empresa."}
      </Text>
    </View>
  );
}