import { View, Text, Pressable } from "react-native";
import { useEmpresas } from "@/features/empresas/empresas.hooks";
import { useEmpresaStore } from "@/store/empresa-store";
import { useAuthStore } from "@/store/auth-store";

export function EmpresaSelector() {
  const { data: empresas } = useEmpresas({ ativa: true });
  const { empresaId, setEmpresaId } = useEmpresaStore();
  // ADMIN pode trocar; usuário comum fica preso à própria empresa
  // Por ora renderiza um selector simples (substitua por Select do UI Kit quando disponível)

  const selecionada = empresas?.find((e) => e.id === empresaId);

  return (
    <View className="flex-row items-center gap-2">
      {empresas?.map((empresa) => (
        <Pressable
          key={empresa.id}
          onPress={() => setEmpresaId(empresa.id)}
          className={`px-3 py-1 rounded-md border ${
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
  );
}