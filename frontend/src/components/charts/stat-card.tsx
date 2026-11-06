import { View } from "react-native";
import type { LucideIcon } from "lucide-react-native";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  alerta?: boolean;
};

// Cartão de indicador: número grande com rótulo, ícone e destaque de alerta.
export function StatCard({ label, value, hint, icon, alerta = false }: StatCardProps) {
  return (
    <View
      className={cn(
        "min-w-[46%] flex-1 rounded-xl border bg-card p-4",
        alerta ? "border-amber-500/60" : "border-border",
      )}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium text-muted-foreground">{label}</Text>
        {icon ? (
          <Icon
            as={icon}
            size={16}
            className={alerta ? "text-amber-500" : "text-muted-foreground"}
          />
        ) : null}
      </View>
      <Text
        className={cn(
          "mt-1 text-3xl font-bold",
          alerta ? "text-amber-600" : "text-foreground",
        )}
      >
        {value}
      </Text>
      {hint ? <Text className="mt-1 text-xs text-muted-foreground">{hint}</Text> : null}
    </View>
  );
}