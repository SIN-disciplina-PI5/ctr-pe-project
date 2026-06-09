import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, TextInput, View } from "react-native";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RoleGate } from "@/components/domain/role-gate";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { formatDateTime } from "@/lib/dates";
import {
  useAddApontamentoOS,
  useDeleteApontamentoOS,
  useEncerrarApontamentoOS,
  useOSApontamentos,
  useUpdateApontamentoOS,
} from "./os-apontamentos.hooks";
import type { ApontamentoOS } from "./os-apontamentos.types";

const schema = z.object({
  inicioEm: z.string().min(1, "Início é obrigatório"),
  descricao: z.string().optional(),
  custoHora: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  ordemServicoId: string;
};

export function OSApontamentosLista({ ordemServicoId }: Props) {
  const { data: apontamentos, isLoading, isError } = useOSApontamentos(ordemServicoId);
  const addMutation = useAddApontamentoOS(ordemServicoId);
  const updateMutation = useUpdateApontamentoOS(ordemServicoId);
  const encerrarMutation = useEncerrarApontamentoOS(ordemServicoId);
  const deleteMutation = useDeleteApontamentoOS(ordemServicoId);

  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<ApontamentoOS | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      inicioEm: new Date().toISOString(),
      descricao: "",
    },
  });

  useEffect(() => {
    if (editItem) {
      reset({
        inicioEm: editItem.inicioEm,
        descricao: editItem.descricao ?? "",
        custoHora: editItem.custoHora ? Number(editItem.custoHora) : undefined,
      });
    } else {
      reset({
        inicioEm: new Date().toISOString(),
        descricao: "",
        custoHora: undefined,
      });
    }
  }, [editItem, reset]);

  function closeModals() {
    setCreateOpen(false);
    setEditItem(null);
  }

  function onCreate(data: FormData) {
    addMutation.mutate(
      {
        inicioEm: data.inicioEm,
        descricao: data.descricao || undefined,
        custoHora: data.custoHora,
      },
      {
        onSuccess: () => {
          Alert.alert("Sucesso", "Apontamento criado.");
          closeModals();
        },
        onError: () => Alert.alert("Erro", "Não foi possível criar o apontamento."),
      },
    );
  }

  function onEdit(data: FormData) {
    if (!editItem) return;

    updateMutation.mutate(
      {
        id: editItem.id,
        dto: {
          inicioEm: data.inicioEm,
          descricao: data.descricao || undefined,
          custoHora: data.custoHora,
        },
      },
      {
        onSuccess: () => {
          Alert.alert("Sucesso", "Apontamento atualizado.");
          closeModals();
        },
        onError: () => Alert.alert("Erro", "Não foi possível atualizar o apontamento."),
      },
    );
  }

  function handleEncerrar(id: string) {
    encerrarMutation.mutate(
      { id },
      {
        onSuccess: () => Alert.alert("Sucesso", "Apontamento encerrado."),
        onError: () => Alert.alert("Erro", "Não foi possível encerrar o apontamento."),
      },
    );
  }

  function handleDelete(id: string) {
    Alert.alert("Excluir apontamento", "Confirma a exclusão deste apontamento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () =>
          deleteMutation.mutate(id, {
            onSuccess: () => Alert.alert("Sucesso", "Apontamento excluído."),
            onError: () => Alert.alert("Erro", "Não foi possível excluir o apontamento."),
          }),
      },
    ]);
  }

  return (
    <View>
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-foreground font-semibold">Apontamentos</Text>
        <RoleGate perfis={["ADMIN", "SUPERVISOR", "TECNICO"]}>
          <Pressable
            onPress={() => setCreateOpen(true)}
            className="bg-primary px-3 py-1.5 rounded-md"
          >
            <Text className="text-primary-foreground text-xs font-medium">+ Adicionar</Text>
          </Pressable>
        </RoleGate>
      </View>

      {isLoading ? <Text className="text-muted-foreground text-sm">Carregando apontamentos...</Text> : null}
      {isError ? <Text className="text-destructive text-sm">Erro ao carregar apontamentos.</Text> : null}
      {!isLoading && (apontamentos?.length ?? 0) === 0 ? (
        <Text className="text-muted-foreground text-sm">Nenhum apontamento adicionado.</Text>
      ) : null}

      {apontamentos?.map((item) => (
        <View key={item.id} className="bg-background border border-border rounded-lg p-3 mb-2">
          <Text className="text-foreground text-sm font-medium">
            {item.usuario?.nome ?? "Usuário"}
          </Text>
          <Text className="text-muted-foreground text-xs">
            Início: {formatDateTime(item.inicioEm)}
          </Text>
          <Text className="text-muted-foreground text-xs">
            Fim: {formatDateTime(item.fimEm) ?? "Em aberto"}
          </Text>
          <Text className="text-muted-foreground text-xs">
            Duração: {item.duracaoMinutos ?? 0} min
          </Text>
          <Text className="text-muted-foreground text-xs">
            Custo hora: {item.custoHora ? `R$ ${Number(item.custoHora).toFixed(2)}` : "-"}
          </Text>
          <Text className="text-muted-foreground text-xs">
            Custo total: {item.custoTotal ? `R$ ${Number(item.custoTotal).toFixed(2)}` : "-"}
          </Text>
          {item.descricao ? (
            <Text className="text-muted-foreground text-xs mt-1">{item.descricao}</Text>
          ) : null}

          <RoleGate perfis={["ADMIN", "SUPERVISOR", "TECNICO"]}>
            <View className="flex-row gap-3 mt-3">
              {!item.fimEm ? (
                <>
                  <Pressable onPress={() => setEditItem(item)}>
                    <Text className="text-primary text-xs">Editar</Text>
                  </Pressable>
                  <Pressable onPress={() => handleEncerrar(item.id)}>
                    <Text className="text-primary text-xs">Encerrar</Text>
                  </Pressable>
                </>
              ) : null}

              <RoleGate perfis={["ADMIN", "SUPERVISOR"]}>
                <Pressable onPress={() => handleDelete(item.id)}>
                  <Text className="text-destructive text-xs">Excluir</Text>
                </Pressable>
              </RoleGate>
            </View>
          </RoleGate>
        </View>
      ))}

      <Modal visible={createOpen || !!editItem} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center p-4">
          <View className="bg-card rounded-xl p-6 w-full max-w-sm">
            <Text className="text-foreground text-lg font-bold mb-4">
              {editItem ? "Editar apontamento" : "Novo apontamento"}
            </Text>

            <Text className="text-foreground text-sm mb-1">Início *</Text>
            <Controller
              control={control}
              name="inicioEm"
              render={({ field }) => (
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  className="border border-border rounded-md px-3 py-2 mb-1 text-foreground bg-background"
                  placeholder="2026-06-09T10:00:00.000Z"
                  placeholderTextColor="#888"
                />
              )}
            />
            {errors.inicioEm ? (
              <Text className="text-destructive text-xs mb-3">{errors.inicioEm.message}</Text>
            ) : null}

            <Text className="text-foreground text-sm mb-1">Descrição</Text>
            <Controller
              control={control}
              name="descricao"
              render={({ field }) => (
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  className="border border-border rounded-md px-3 py-2 mb-3 text-foreground bg-background"
                  placeholder="Observações"
                  placeholderTextColor="#888"
                />
              )}
            />

            <Text className="text-foreground text-sm mb-1">Custo/hora</Text>
            <Controller
              control={control}
              name="custoHora"
              render={({ field }) => (
                <TextInput
                  value={field.value ? String(field.value) : ""}
                  onChangeText={(value) => field.onChange(value ? Number(value) : undefined)}
                  className="border border-border rounded-md px-3 py-2 mb-4 text-foreground bg-background"
                  placeholder="Ex: 80"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                />
              )}
            />

            <View className="flex-row gap-3">
              <Pressable
                onPress={closeModals}
                className="flex-1 border border-border py-2 rounded-md items-center"
              >
                <Text className="text-foreground text-sm">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit(editItem ? onEdit : onCreate)}
                disabled={addMutation.isPending || updateMutation.isPending}
                className="flex-1 bg-primary py-2 rounded-md items-center"
              >
                <Text className="text-primary-foreground text-sm font-semibold">
                  {addMutation.isPending || updateMutation.isPending ? "Salvando..." : "Salvar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}