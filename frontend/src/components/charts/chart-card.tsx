import type { ReactNode } from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/text";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
};

// Cartão padrão que envolve cada gráfico ou lista, com título, subtítulo e ação.
export function ChartCard({ title, subtitle, action, children }: ChartCardProps) {
  return (
    <View className="rounded-2xl border border-border bg-card p-5">
      <View className="mb-4 flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-semibold tracking-tight text-foreground">
            {title}
          </Text>
          {subtitle ? (
            <Text className="mt-0.5 text-xs text-muted-foreground">{subtitle}</Text>
          ) : null}
        </View>
        {action}
      </View>
      {children}
    </View>
  );
}
