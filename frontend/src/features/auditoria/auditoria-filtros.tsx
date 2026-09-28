import { useMemo } from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  type Option,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { useUsuarios } from "@/features/usuarios/usuarios.hooks";
import type { TipoAcaoAuditoria } from "./auditoria.types";

const ALL_VALUE = "__ALL__";

const ENTIDADE_OPTIONS: FilterOption[] = [
  { value: ALL_VALUE, label: "Todas as entidades" },
  { value: "empresas", label: "Empresas" },
  { value: "localizacoes", label: "Localizações" },
  { value: "usuarios", label: "Usuários" },
  { value: "ativos", label: "Ativos" },
  { value: "ordens-servico", label: "Ordens de serviço" },
  { value: "paradas-ativos", label: "Paradas de ativos" },
  { value: "materiais", label: "Materiais" },
  {
    value: "ordens-servico-materiais",
    label: "Materiais de O.S.",
  },
  { value: "apontamentos-os", label: "Apontamentos de O.S." },
  { value: "alertas", label: "Alertas" },
];

const ACAO_OPTIONS: FilterOption[] = [
  { value: ALL_VALUE, label: "Todas as ações" },
  { value: "CRIACAO", label: "Criação" },
  { value: "ALTERACAO", label: "Alteração" },
  { value: "EXCLUSAO", label: "Exclusão" },
  { value: "LOGIN", label: "Login" },
  { value: "LOGOUT", label: "Logout" },
  { value: "ENCERRAMENTO_OS", label: "Encerramento de O.S." },
  { value: "CANCELAMENTO_OS", label: "Cancelamento de O.S." },
];

type FilterOption = NonNullable<Option>;

type AuditoriaFiltrosProps = {
  empresaId?: string;
  usuarioId?: string;
  entidade?: string;
  acao?: TipoAcaoAuditoria;
  onUsuarioIdChange: (usuarioId: string | undefined) => void;
  onEntidadeChange: (entidade: string | undefined) => void;
  onAcaoChange: (acao: TipoAcaoAuditoria | undefined) => void;
  onClear: () => void;
};

function findSelectedOption(
  options: FilterOption[],
  value: string | undefined,
): FilterOption | undefined {
  if (!value) {
    return options.find((option) => option.value === ALL_VALUE);
  }

  return options.find((option) => option.value === value);
}

export function AuditoriaFiltros({
  empresaId,
  usuarioId,
  entidade,
  acao,
  onUsuarioIdChange,
  onEntidadeChange,
  onAcaoChange,
  onClear,
}: AuditoriaFiltrosProps) {
  const insets = useSafeAreaInsets();

  const { data: usuarios, isLoading: isLoadingUsuarios } = useUsuarios({
    empresaId,
    ativo: true,
  });

  const contentInsets = {
    top: insets.top,
    bottom:
      Platform.select({
        ios: insets.bottom,
        android: insets.bottom + 24,
      }) ?? 24,
    left: 12,
    right: 12,
  };

  const usuarioOptions = useMemo<FilterOption[]>(
    () => [
      { value: ALL_VALUE, label: "Todos os usuários" },
      ...(usuarios ?? []).map((usuario) => ({
        value: usuario.id,
        label: usuario.nome,
      })),
    ],
    [usuarios],
  );

  const hasFilters = !!usuarioId || !!entidade || !!acao;

  return (
    <View className="mb-4 rounded-xl border border-border bg-card p-4">
      <View className="mb-3">
        <Text className="font-semibold text-foreground">Filtros</Text>
        <Text className="text-sm text-muted-foreground">
          A empresa é definida pelo seletor do cabeçalho.
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        <View className="min-w-[180px] flex-1">
          <Text className="mb-1 text-xs text-muted-foreground">
            Usuário
          </Text>

          <Select
            value={findSelectedOption(usuarioOptions, usuarioId)}
            onValueChange={(option) =>
              onUsuarioIdChange(
                option?.value === ALL_VALUE
                  ? undefined
                  : option?.value,
              )
            }
            disabled={isLoadingUsuarios}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                className="flex-1"
                placeholder={
                  isLoadingUsuarios
                    ? "Carregando usuários..."
                    : "Todos os usuários"
                }
              />
            </SelectTrigger>

            <SelectContent insets={contentInsets}>
              <SelectGroup>
                <SelectLabel>Usuários</SelectLabel>

                {usuarioOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>

        <View className="min-w-[180px] flex-1">
          <Text className="mb-1 text-xs text-muted-foreground">
            Entidade
          </Text>

          <Select
            value={findSelectedOption(ENTIDADE_OPTIONS, entidade)}
            onValueChange={(option) =>
              onEntidadeChange(
                option?.value === ALL_VALUE
                  ? undefined
                  : option?.value,
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                className="flex-1"
                placeholder="Todas as entidades"
              />
            </SelectTrigger>

            <SelectContent insets={contentInsets}>
              <SelectGroup>
                <SelectLabel>Entidades</SelectLabel>

                {ENTIDADE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>

        <View className="min-w-[180px] flex-1">
          <Text className="mb-1 text-xs text-muted-foreground">
            Ação
          </Text>

          <Select
            value={findSelectedOption(ACAO_OPTIONS, acao)}
            onValueChange={(option) =>
              onAcaoChange(
                option?.value === ALL_VALUE
                  ? undefined
                  : option?.value as TipoAcaoAuditoria,
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                className="flex-1"
                placeholder="Todas as ações"
              />
            </SelectTrigger>

            <SelectContent insets={contentInsets}>
              <SelectGroup>
                <SelectLabel>Ações</SelectLabel>

                {ACAO_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>
      </View>

      <View className="mt-4 flex-row justify-end">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasFilters}
          onPress={onClear}
        >
          <Text>Limpar filtros</Text>
        </Button>
      </View>
    </View>
  );
}