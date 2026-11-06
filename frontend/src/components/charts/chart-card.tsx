import type { ReactNode } from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/text";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

// Cartão padrão que envolve cada gráfico, com título e subtítulo.
export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <View className="rounded-xl border border-border bg-card p-4">
      <Text className="text-base font-semibold text-foreground">{title}</Text>
      {subtitle ? (
        <Text className="mb-4 mt-0.5 text-xs text-muted-foreground">{subtitle}</Text>
      ) : (
        <View className="mb-4" />
      )}
      {children}
    </View>
  );
}