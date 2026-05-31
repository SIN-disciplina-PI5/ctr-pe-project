import { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import {
  useOSMateriais,
  useConsumirMaterialOS,
  useDevolverMaterialOS,
  useCancelarMaterialOS,
} from "./os-materiais.hooks";
import { ModalEditarMaterialOS } from "./modal-editar-material-os";
import { RoleGate } from "@/components/domain/role-gate";
import type { OrdemServicoMaterial, StatusMaterialOS } from "./os-materiais.types";

const STATUS_LABELS: Record<StatusMaterialOS, string> = {
  SOLICITADO: "Solicitado",
  CONSUMIDO: "Consumido",
  DEVOLVIDO: "Devolvido",
  CANCELADO: "Cancelado",
};

const STATUS_COLORS: Record<StatusMaterialOS, string> = {
  SOLICITADO: "bg-yellow-100",
  CONSUMIDO: "bg-green-100",
  DEVOLVIDO: "bg-blue-100",
  CANCELADO: "bg-muted",
};

const STATUS_TEXT_COLORS: Record<StatusMaterialOS, string> = {
  SOLICITADO: "text-yellow-700",
  CONSUMIDO: "text-green-700",
  DEVOLVIDO: "text-blue-700",
  CANCELADO: "text-muted-foreground",
};

type OSMateriaisListaProps = {
  ordemServicoId: string;
  onAddPress: () => void;
};

export function OSMateriaisLista({ ordemServicoId, onAddPress }: OSMateriaisListaProps) {
  const { data: materiais, isLoading, isError } = useOSMateriais(ordemServicoId);
  const { mutate: consumir } = useConsumirMaterialOS(ordemServicoId);
  const { mutate: devolver } = useDevolverMaterialOS(ordemServicoId);
  const { mutate: cancelar } = useCancelarMaterialOS(ordemServicoId);
  const [editItem, setEditItem] = useState<OrdemServicoMaterial | null>(null);

  function handleConsumit(id: string) {
    Alert.alert("Consumir material", "Confirmar consumo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Consumir",
        onPress: () =>
          consumir(
            { id },
            { onError: () => Alert.alert("Erro", "Não foi possível consumir o material.") }
          ),
      },
    ]);
  }

  function handleDevolver(id: string) {
    Alert.alert("Devolver material", "Confirmar devolução?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Devolver",
        onPress: () =>
          devolver(
            { id },
            { onError: () => Alert.alert("Erro", "Não foi possível devolver o material.") }
          ),
      },
    ]);
  }

  function handleCancelar(id: string) {
    Alert.alert("Cancelar material", "Confirmar cancelamento?", [
      { text: "Voltar", style: "cancel" },
      {
        text: "Cancelar item",
        style: "destructive",
        onPress: () =>
          cancelar(
            { id },
            { onError: () => Alert.alert("Erro", "Não foi possível cancelar o material.") }
          ),
      },
    ]);
  }

  const custoTotal = materiais
    ?.filter((m) => m.status === "CONSUMIDO")
    .reduce((acc, m) => acc + Number(m.custoTotal), 0) ?? 0;

  return (
    <View>
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-foreground font-semibold">Materiais</Text>
        <RoleGate perfis={["ADMIN", "SUPERVISOR", "TECNICO"]}>
          <Pressable onPress={onAddPress} className="bg-primary px-3 py-1.5 rounded-md">
            <Text className="text-primary-foreground text-xs font-medium">+ Adicionar</Text>
          </Pressable>
        </RoleGate>
      </View>

      {isLoading && <Text className="text-muted-foreground text-sm">Carregando materiais...</Text>}
      {isError && <Text className="text-destructive text-sm">Erro ao carregar materiais.</Text>}

      {materiais?.length === 0 && !isLoading && (
        <Text className="text-muted-foreground text-sm">Nenhum material adicionado.</Text>
      )}

      {materiais?.map((item) => (
        <View key={item.id} className="bg-background border border-border rounded-lg p-3 mb-2">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-foreground text-sm font-medium flex-1 mr-2">
              {item.material?.nome ?? item.materialId}
            </Text>
            <View className={`px-2 py-0.5 rounded-full ${STATUS_COLORS[item.status]}`}>
              <Text className={`text-xs ${STATUS_TEXT_COLORS[item.status]}`}>
                {STATUS_LABELS[item.status]}
              </Text>
            </View>
          </View>

          {item.material?.codigo && (
            <Text className="text-muted-foreground text-xs mb-1">{item.material.codigo}</Text>
          )}

          <View className="flex-row gap-4 mb-2">
            <Text className="text-muted-foreground text-xs">Qtd: {item.quantidade}</Text>
            <Text className="text-muted-foreground text-xs">
              Unit: R$ {Number(item.custoUnitario).toFixed(2)}
            </Text>
            <Text className="text-muted-foreground text-xs">
              Total: R$ {Number(item.custoTotal).toFixed(2)}
            </Text>
          </View>

          <RoleGate perfis={["ADMIN", "SUPERVISOR", "TECNICO"]}>
            <View className="flex-row gap-3">
              {item.status === "SOLICITADO" && (
                <>
                  <Pressable onPress={() => setEditItem(item)}>
                    <Text className="text-primary text-xs">Editar</Text>
                  </Pressable>
                  <Pressable onPress={() => handleConsumit(item.id)}>
                    <Text className="text-primary text-xs">Consumir</Text>
                  </Pressable>
                  <Pressable onPress={() => handleCancelar(item.id)}>
                    <Text className="text-destructive text-xs">Cancelar</Text>
                  </Pressable>
                </>
              )}
              {item.status === "CONSUMIDO" && (
                <Pressable onPress={() => handleDevolver(item.id)}>
                  <Text className="text-primary text-xs">Devolver</Text>
                </Pressable>
              )}
            </View>
          </RoleGate>
        </View>
      ))}

      {/* Custo total dos materiais consumidos */}
      {materiais && materiais.length > 0 && (
        <View className="flex-row justify-end mt-2 pt-2 border-t border-border">
          <Text className="text-muted-foreground text-sm mr-2">Custo total (consumidos):</Text>
          <Text className="text-foreground text-sm font-semibold">
            R$ {custoTotal.toFixed(2)}
          </Text>
        </View>
      )}

      <ModalEditarMaterialOS
        item={editItem}
        ordemServicoId={ordemServicoId}
        onClose={() => setEditItem(null)}
      />
    </View>
  );
}