import { View } from "react-native";
import Svg, { Line } from "react-native-svg";

import { Text } from "@/components/ui/text";

type GaugeChartProps = {
  value: number; // 0 a 100
  label?: string;
  size?: number;
};

const COR_INICIAL = [255, 200, 69]; // amarelo
const COR_FINAL = [242, 106, 33]; // laranja

function corDaPosicao(posicao: number) {
  const [r, g, b] = COR_INICIAL.map((inicio, i) =>
    Math.round(inicio + (COR_FINAL[i] - inicio) * posicao),
  );
  return `rgb(${r}, ${g}, ${b})`;
}

// Medidor em meia-lua feito de marcas, do amarelo ao laranja. Funciona em web e mobile.
export function GaugeChart({ value, label, size = 240 }: GaugeChartProps) {
  const percentual = Math.max(0, Math.min(100, Math.round(value)));
  const marcas = 36;
  const preenchidas = Math.round((percentual / 100) * marcas);
  const espessura = Math.round(size * 0.13);
  const raioExterno = size / 2 - 6;
  const raioInterno = raioExterno - espessura;
  const centro = size / 2;
  const altura = centro + 10;

  return (
    <View style={{ width: size, height: altura }} className="items-center">
      <Svg width={size} height={altura}>
        {Array.from({ length: marcas }).map((_, indice) => {
          const angulo = Math.PI + (indice / (marcas - 1)) * Math.PI;
          const cos = Math.cos(angulo);
          const sin = Math.sin(angulo);
          const ativa = indice < preenchidas;
          return (
            <Line
              key={indice}
              x1={centro + raioInterno * cos}
              y1={centro + raioInterno * sin}
              x2={centro + raioExterno * cos}
              y2={centro + raioExterno * sin}
              stroke={ativa ? corDaPosicao(indice / (marcas - 1)) : "#A1A1AA"}
              strokeOpacity={ativa ? 1 : 0.28}
              strokeWidth={Math.max(3, size * 0.022)}
              strokeLinecap="round"
            />
          );
        })}
      </Svg>
      <View className="absolute bottom-0 items-center">
        <Text className="text-5xl font-bold tracking-tight text-foreground">
          {percentual}%
        </Text>
        {label ? <Text className="text-xs text-muted-foreground">{label}</Text> : null}
      </View>
    </View>
  );
}
