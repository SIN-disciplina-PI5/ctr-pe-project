import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

interface QrCodeSvgProps {
  value: string;
  size?: number;
}

const QUIET_ZONE = 8;

export function QrCodeSvg({ value, size = 160 }: QrCodeSvgProps) {
  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        height: size,
        justifyContent: "center",
        padding: QUIET_ZONE,
        width: size,
      }}
    >
      <QRCode
        value={value}
        size={Math.max(size - QUIET_ZONE * 2, 1)}
        color="#0F172A"
        backgroundColor="#FFFFFF"
      />
    </View>
  );
}
