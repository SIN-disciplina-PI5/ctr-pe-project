import { View, useWindowDimensions } from "react-native";
import Svg, { Polygon } from "react-native-svg";

import { Text } from "@/components/ui/text";

type LogoIconProps = {
  size?: number;
};

// Ícone "M" em dois tons de azul.
export function LogoIcon({ size = 32 }: LogoIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Polygon
        fill="#1E3A8A"
        points="6,52 6,12 17,12 32,36 32,48 28,48 18,32 18,52"
      />
      <Polygon
        fill="#3B82F6"
        points="32,36 47,12 58,12 58,52 46,52 46,32 36,48 32,48"
      />
    </Svg>
  );
}

type LogoProps = {
  showName?: boolean;
};

// Logo completa: ícone + nome. Em telas estreitas (celular) mostra só o ícone.
export function Logo({ showName }: LogoProps) {
  const { width } = useWindowDimensions();
  const mostrarNome = showName ?? width >= 768;

  return (
    <View className="flex-row items-center gap-2">
      <LogoIcon size={32} />
      {mostrarNome ? (
        <Text className="text-lg font-bold tracking-wide text-foreground">
          MAQCONTROL
        </Text>
      ) : null}
    </View>
  );
}