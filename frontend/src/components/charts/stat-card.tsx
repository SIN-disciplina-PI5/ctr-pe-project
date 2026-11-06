import { View } from "react-native";

import { Text } from "@/components/ui/text";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

// Cartão de indicador: um número grande com rótulo e dica opcional.
export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <View className="min-w-[46%] flex-1 rounded-xl border border-border bg-card p-4">
      <Text className="text-xs font-medium text-muted-foreground">{label}</Text>
      <Text className="mt-1 text-3xl font-bold text-foreground">{value}</Text>
      {hint ? <Text className="mt-1 text-xs text-muted-foreground">{hint}</Text> : null}
    </View>
  );
}