import { useMemo } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
import { useEmpresas } from "@/features/empresas/empresas.hooks";
import { useEmpresaStore } from "@/store/empresa-store";

const ALL_VALUE = "__ALL__";

export function EmpresaCompactSelect() {
    const insets = useSafeAreaInsets();
    const { empresaId, setEmpresaId } = useEmpresaStore();
    const { data: empresas, isLoading } = useEmpresas({ ativa: true });

    const contentInsets = {
        top: insets.top,
        bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }) ?? 24,
        left: 12,
        right: 12,
    };

    const options = useMemo(
        () => [
            { value: ALL_VALUE, label: "Sem filtro" },
            ...(empresas ?? []).map((empresa) => ({
                value: empresa.id,
                label: empresa.nome,
            })),
        ],
        [empresas],
    );

    const selectedOption: Option = useMemo(() => {
        if (!empresaId) {
            return options[0];
        }

        return options.find((option) => option.value === empresaId);
    }, [empresaId, options]);

    if (isLoading) {
        return (
            <View className="h-9 w-full max-w-[220px] items-center justify-center">
                <ActivityIndicator size="small" />
            </View>
        );
    }

    return (
        <Select
            value={selectedOption}
            onValueChange={(option) =>
                setEmpresaId(option?.value === ALL_VALUE ? null : option?.value ?? null)
            }
        >
            <SelectTrigger className="h-9 w-full max-w-[220px]">
                <SelectValue className="flex-1" placeholder="Empresa" />
            </SelectTrigger>
            <SelectContent insets={contentInsets}>
                <SelectGroup>
                    <SelectLabel>Empresa</SelectLabel>
                    {options.map((option) => (
                        <SelectItem key={option.value} label={option.label} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}