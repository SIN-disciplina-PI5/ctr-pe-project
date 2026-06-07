import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, Platform, ScrollView, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { STATUS_OS_LABEL, TIPO_OS_LABEL } from "@/constants/status";
import { useAtivos } from "@/features/ativos/ativos.hooks";
import { useEmpresas } from "@/features/empresas/empresas.hooks";
import { useOrdensServico } from "@/features/ordens-servico/ordens-servico.hooks";
import { useCreateParada } from "@/features/paradas/paradas.hooks";
import {
  createParadaSchema,
  type CreateParadaFormData,
} from "@/features/paradas/paradas.schemas";
import { useSelectedEmpresaId } from "@/hooks/use-selected-empresa";

const NO_OS_VALUE = "__SEM_OS__";

export default function ParadaNovaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const empresaInicial = useSelectedEmpresaId();

  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }) ?? 24,
    left: 12,
    right: 12,
  };

  const { data: empresas, isLoading: empresasLoading } = useEmpresas({ ativa: true });
  const { mutate: createParada, isPending } = useCreateParada();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateParadaFormData>({
    resolver: zodResolver(createParadaSchema),
    defaultValues: {
      empresaId: empresaInicial ?? "",
      ativoId: "",
      ordemServicoId: undefined,
      inicioEm: new Date().toISOString(),
      motivo: "",
      programada: false,
      impactaDisponibilidade: true,
    },
  });

  const empresaId = watch("empresaId");
  const ativoId = watch("ativoId");

  const { data: ativos, isLoading: ativosLoading } = useAtivos({
    empresaId: empresaId || undefined,
  });

  const { data: ordensServico, isLoading: ordensLoading } = useOrdensServico({
    empresaId: empresaId || undefined,
    ativoId: ativoId || undefined,
  });

  const ordensDisponiveis =
    ordensServico?.filter(
      (os) => os.status !== "ENCERRADA" && os.status !== "CANCELADA",
    ) ?? [];

  useEffect(() => {
    setValue("ativoId", "");
    setValue("ordemServicoId", undefined);
  }, [empresaId, setValue]);

  useEffect(() => {
    setValue("ordemServicoId", undefined);
  }, [ativoId, setValue]);

  function onSubmit(data: CreateParadaFormData) {
    createParada(
      {
        ...data,
        motivo: data.motivo?.trim() || undefined,
        ordemServicoId: data.ordemServicoId || undefined,
      },
      {
        onSuccess: () => {
          Alert.alert("Sucesso", "Parada registrada.");
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/(protected)/paradas");
          }
        },
        onError: () => {
          Alert.alert("Erro", "Não foi possível registrar a parada.");
        },
      },
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4">
        <View>
          <Text className="text-2xl font-bold">Nova parada</Text>
          <Text className="text-sm text-muted-foreground">
            Registre uma indisponibilidade manual de ativo.
          </Text>
        </View>

        <Card>
          <CardHeader>
            <CardTitle>Empresa</CardTitle>
          </CardHeader>
          <CardContent className="gap-2">
            {empresasLoading ? (
              <ActivityIndicator />
            ) : (
              <Controller
                control={control}
                name="empresaId"
                render={({ field }) => (
                  <Select
                    value={
                      empresas?.find((empresa) => empresa.id === field.value)
                        ? {
                          value: field.value,
                          label:
                            empresas.find((empresa) => empresa.id === field.value)?.nome ?? "",
                        }
                        : undefined
                    }
                    onValueChange={(option) => field.onChange(option?.value ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent insets={contentInsets}>
                      <SelectGroup>
                        <SelectLabel>Empresas</SelectLabel>
                        {empresas?.map((empresa) => (
                          <SelectItem
                            key={empresa.id}
                            label={empresa.nome}
                            value={empresa.id}
                          >
                            {empresa.nome}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            )}

            {errors.empresaId ? (
              <Text className="text-destructive text-xs">{errors.empresaId.message}</Text>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ativo</CardTitle>
          </CardHeader>
          <CardContent className="gap-2">
            {!empresaId ? (
              <Text className="text-sm text-muted-foreground">
                Selecione uma empresa antes de escolher o ativo.
              </Text>
            ) : ativosLoading ? (
              <ActivityIndicator />
            ) : (
              <Controller
                control={control}
                name="ativoId"
                render={({ field }) => (
                  <Select
                    value={
                      ativos?.find((ativo) => ativo.id === field.value)
                        ? {
                          value: field.value,
                          label: `${ativos.find((ativo) => ativo.id === field.value)?.codigo ?? ""
                            } - ${ativos.find((ativo) => ativo.id === field.value)?.nome ?? ""}`,
                        }
                        : undefined
                    }
                    onValueChange={(option) => field.onChange(option?.value ?? "")}
                    disabled={!ativos?.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ativo" />
                    </SelectTrigger>
                    <SelectContent insets={contentInsets}>
                      <SelectGroup>
                        <SelectLabel>Ativos</SelectLabel>
                        {ativos?.map((ativo) => (
                          <SelectItem
                            key={ativo.id}
                            label={`${ativo.codigo} - ${ativo.nome}`}
                            value={ativo.id}
                          >
                            {ativo.codigo} - {ativo.nome}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            )}

            {ativos?.length === 0 && empresaId ? (
              <Text className="text-sm text-muted-foreground">
                Nenhum ativo encontrado para a empresa selecionada.
              </Text>
            ) : null}

            {errors.ativoId ? (
              <Text className="text-destructive text-xs">{errors.ativoId.message}</Text>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ordem de Serviço vinculada</CardTitle>
          </CardHeader>
          <CardContent className="gap-2">
            {!ativoId ? (
              <Text className="text-sm text-muted-foreground">
                Selecione um ativo para listar as O.S.
              </Text>
            ) : ordensLoading ? (
              <ActivityIndicator />
            ) : (
              <Controller
                control={control}
                name="ordemServicoId"
                render={({ field }) => (
                  <Select
                    value={
                      field.value
                        ? {
                          value: field.value,
                          label: `${ordensDisponiveis.find((os) => os.id === field.value)?.numero ?? ""
                            } - ${ordensDisponiveis.find((os) => os.id === field.value)?.titulo ?? ""
                            }`,
                        }
                        : undefined
                    }
                    onValueChange={(option) =>
                      field.onChange(option?.value === NO_OS_VALUE ? undefined : option?.value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a O.S. ou deixe sem vínculo" />
                    </SelectTrigger>
                    <SelectContent insets={contentInsets}>
                      <SelectGroup>
                        <SelectLabel>Ordens de Serviço</SelectLabel>

                        <SelectItem
                          label="Sem O.S. vinculada"
                          value={NO_OS_VALUE}
                        >
                          Sem O.S. vinculada
                        </SelectItem>

                        {ordensDisponiveis.map((os) => (
                          <SelectItem
                            key={os.id}
                            label={`${os.numero} - ${os.titulo}`}
                            value={os.id}
                          >
                            {os.numero} - {os.titulo} ({TIPO_OS_LABEL[os.tipo]} /{" "}
                            {STATUS_OS_LABEL[os.status]})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            )}

            {ordensDisponiveis.length === 0 && ativoId ? (
              <Text className="text-sm text-muted-foreground">
                Nenhuma O.S. aberta para esse ativo.
              </Text>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados da parada</CardTitle>
          </CardHeader>
          <CardContent className="gap-4">
            <Controller
              control={control}
              name="inicioEm"
              render={({ field }) => (
                <View className="gap-1">
                  <Text className="text-sm font-medium">Início</Text>
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    placeholder="2026-06-06T10:00:00.000Z"
                  />
                </View>
              )}
            />
            {errors.inicioEm ? (
              <Text className="text-destructive text-xs">{errors.inicioEm.message}</Text>
            ) : null}

            <Controller
              control={control}
              name="motivo"
              render={({ field }) => (
                <View className="gap-1">
                  <Text className="text-sm font-medium">Motivo</Text>
                  <Input
                    value={field.value}
                    onChangeText={field.onChange}
                    placeholder="Ex: parada para manutenção preventiva"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="programada"
              render={({ field }) => (
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-medium">Programada</Text>
                  <Switch value={field.value} onValueChange={field.onChange} />
                </View>
              )}
            />

            <Controller
              control={control}
              name="impactaDisponibilidade"
              render={({ field }) => (
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-medium">Impacta disponibilidade</Text>
                  <Switch value={field.value} onValueChange={field.onChange} />
                </View>
              )}
            />
          </CardContent>
        </Card>

        <Button onPress={handleSubmit(onSubmit)} disabled={isPending}>
          <Text>{isPending ? "Salvando..." : "Registrar parada"}</Text>
        </Button>
      </View>
    </ScrollView>
  );
}