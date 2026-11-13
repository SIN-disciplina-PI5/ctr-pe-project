import { View } from "react-native";

import type { BarDatum } from "@/components/charts/bar-chart";
import { Text } from "@/components/ui/text";
import { corDoRotulo } from "@/lib/chart-colors";

type ColumnChartProps = {
  data: BarDatum[];
  height?: number;
  formatValue?: (value: number) => string;
  emptyMessage?: string;
};

// Gráfico de colunas verticais, feito só com View.
export function ColumnChart({
  data,
  height = 150,
  formatValue,
  emptyMessage = "Sem dados para exibir.",
}: ColumnChartProps) {
  if (data.length === 0) {
    return <Text className="text-sm text-muted-foreground">{emptyMessage}</Text>;
  }

  const maior = Math.max(1, ...data.map((item) => item.value));

  return (
    <View className="flex-row items-end justify-between gap-2">
      {data.map((item, indice) => {
        const altura = Math.max(Math.round((item.value / maior) * height), 4);
        return (
          <View key={item.label} className="flex-1 items-center justify-end gap-1">
            <Text className="text-xs font-semibold text-foreground">
              {formatValue ? formatValue(item.value) : item.value}
            </Text>
            <View
              className="w-full max-w-[56px] rounded-t-md"
              style={{
                height: altura,
                backgroundColor: corDoRotulo(item.label, indice),
              }}
            />
            <Text numberOfLines={1} className="text-center text-xs text-muted-foreground">
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}