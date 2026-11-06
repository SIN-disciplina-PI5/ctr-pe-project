import { View, useWindowDimensions } from "react-native";
import Svg, { Polygon } from "react-native-svg";

import { Text } from "@/components/ui/text";

type LogoIconProps = {
  size?: number;
  claro?: boolean;
};

// Ícone "M" em dois tons. A versão clara é para fundos escuros.
export function LogoIcon({ size = 32, claro = false }: LogoIconProps) {
  const corA = claro ? "#FFFFFF" : "#1E3A8A";
  const corB = claro ? "#93C5FD" : "#3B82F6";

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Polygon
        fill={corA}
        points="6,52 6,12 17,12 32,36 32,48 28,48 18,32 18,52"
      />
      <Polygon
        fill={corB}
        points="32,36 47,12 58,12 58,52 46,52 46,32 36,48 32,48"
      />
    </Svg>
  );
}

type LogoProps = {
  showName?: boolean;
  claro?: boolean;
  size?: number;
};

// Logo completa: ícone + nome. Em telas estreitas mostra só o ícone,
// a menos que showName seja informado.
export function Logo({ showName, claro = false, size = 32 }: LogoProps) {
  const { width } = useWindowDimensions();
  const mostrarNome = showName ?? width >= 768;

  return (
    <View className="flex-row items-center gap-2">
      <LogoIcon size={size} claro={claro} />
      {mostrarNome ? (
        <Text
          style={{ fontSize: Math.round(size * 0.56), letterSpacing: 1 }}
          className={claro ? "font-bold text-white" : "font-bold text-foreground"}
        >
          MAQCONTROL
        </Text>
      ) : null}
    </View>
  );
}