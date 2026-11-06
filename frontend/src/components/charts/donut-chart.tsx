import { View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

import type { BarDatum } from "@/components/charts/bar-chart";
import { Text } from "@/components/ui/text";
import { corDoRotulo } from "@/lib/chart-colors";

type DonutChartProps = {
  data: BarDatum[];
  centerValue?: string | number;
  centerLabel?: string;
  size?: number;
  formatValue?: (value: number) => string;
  emptyMessage?: string;
};

// Gráfico de rosca feito com SVG (funciona em web e mobile).
export function DonutChart({
  data,
  centerValue,
  centerLabel,
  size = 176,
  formatValue,
  emptyMessage = "Sem dados para exibir.",
}: DonutChartProps) {
  const total = data.reduce((soma, item) => soma + item.value, 0);

  if (data.length === 0 || total === 0) {
    return <Text className="text-sm text-muted-foreground">{emptyMessage}</Text>;
  }

  const espessura = 24;
  const centro = size / 2;
  const raio = (size - espessura) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const textoCentro = String(
    centerValue ?? (formatValue ? formatValue(total) : total),
  );
  let acumulado = 0;

  return (
    <View className="flex-row flex-wrap items-center justify-center gap-6">
      <View
        style={{ width: size, height: size }}
        className="items-center justify-center"
      >
        <Svg width={size} height={size}>
          <G rotation={-90} origin={`${centro}, ${centro}`}>
            <Circle
              cx={centro}
              cy={centro}
              r={raio}
              stroke="#94A3B8"
              strokeOpacity={0.25}
              strokeWidth={espessura}
              fill="none"
            />
            {data.map((item, indice) => {
              const tamanho = (item.value / total) * circunferencia;
              const inicio = acumulado;
              acumulado += tamanho;
              return (
                <Circle
                  key={item.label}
                  cx={centro}
                  cy={centro}
                  r={raio}
                  stroke={corDoRotulo(item.label, indice)}
                  strokeWidth={espessura}
                  fill="none"
                  strokeDasharray={`${tamanho} ${circunferencia - tamanho}`}
                  strokeDashoffset={-inicio}
                />
              );
            })}
          </G>
        </Svg>

        <View className="absolute items-center">
          <Text
            className={
              textoCentro.length > 7
                ? "text-lg font-bold text-foreground"
                : "text-3xl font-bold text-foreground"
            }
          >
            {textoCentro}
          </Text>
          {centerLabel ? (
            <Text className="text-xs text-muted-foreground">{centerLabel}</Text>
          ) : null}
        </View>
      </View>

      <View className="min-w-[170px] gap-2">
        {data.map((item, indice) => (
          <View key={item.label} className="flex-row items-center gap-2">
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: corDoRotulo(item.label, indice),
              }}
            />
            <Text className="flex-1 text-sm text-foreground">{item.label}</Text>
            <Text className="text-sm font-semibold text-foreground">
              {formatValue ? formatValue(item.value) : item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}