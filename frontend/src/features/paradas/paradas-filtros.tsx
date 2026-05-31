import { View, Text, Pressable } from "react-native";
import type { StatusParada } from "./paradas.types";

const STATUS_OPTIONS: { label: string; value: StatusParada | undefined }[] = [
  { label: "Todas", value: undefined },
  { label: "Aberta", value: "ABERTA" },
  { label: "Encerrada", value: "ENCERRADA" },
  { label: "Cancelada", value: "CANCELADA" },
];

type ParadasFiltrosProps = {
  status: StatusParada | undefined;
  onStatusChange: (status: StatusParada | undefined) => void;
};

export function ParadasFiltros({ status, onStatusChange }: ParadasFiltrosProps) {
  return (
    <View className="flex-row flex-wrap gap-2 mb-4">
      {STATUS_OPTIONS.map((op) => (
        <Pressable
          key={String(op.value)}
          onPress={() => onStatusChange(op.value)}
          className={`px-3 py-1 rounded-full border ${
            status === op.value ? "bg-primary border-primary" : "border-border bg-card"
          }`}
        >
          <Text
            className={`text-xs ${
              status === op.value ? "text-primary-foreground" : "text-foreground"
            }`}
          >
            {op.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}