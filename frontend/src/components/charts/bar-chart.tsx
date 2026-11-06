import { View } from "react-native";

import { Text } from "@/components/ui/text";

export type BarDatum = {
  label: string;
  value: number;
};

type BarChartProps = {
  data: BarDatum[];
  formatValue?: (value: number) => string;
  emptyMessage?: string;
};

// Gráfico de barras horizontais, feito só com View (funciona em web e mobile).
export function BarChart({
  data,
  formatValue,
  emptyMessage = "Sem dados para exibir.",
}: BarChartProps) {
  if (data.length === 0) {
    return <Text className="text-sm text-muted-foreground">{emptyMessage}</Text>;
  }

  const maior = Math.max(1, ...data.map((item) => item.value));

  return (
    <View className="gap-3">
      {data.map((item) => {
        const largura = Math.round((item.value / maior) * 100);
        return (
          <View key={item.label} className="gap-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-foreground">{item.label}</Text>
              <Text className="text-sm font-semibold text-foreground">
                {formatValue ? formatValue(item.value) : item.value}
              </Text>
            </View>
            <View className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <View
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(largura, 2)}%` }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}