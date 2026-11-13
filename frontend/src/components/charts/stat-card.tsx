import { Pressable, View } from "react-native";
import { ArrowUpRight, type LucideIcon } from "lucide-react-native";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  alerta?: boolean;
  onPress?: () => void;
};

// Cartão de indicador: número grande, ícone em destaque e atalho opcional.
export function StatCard({
  label,
  value,
  hint,
  icon,
  alerta = false,
  onPress,
}: StatCardProps) {
  const conteudo = (
    <View
      className={cn(
        "min-h-[132px] justify-between rounded-2xl border bg-card p-5",
        alerta ? "border-brand/50" : "border-border",
      )}
    >
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 flex-row items-center gap-2.5">
          {icon ? (
            <View
              className={cn(
                "h-8 w-8 items-center justify-center rounded-lg",
                alerta ? "bg-brand" : "bg-accent",
              )}
            >
              <Icon
                as={icon}
                size={16}
                className={alerta ? "text-brand-foreground" : "text-accent-foreground"}
              />
            </View>
          ) : null}
          <Text numberOfLines={1} className="flex-1 text-sm font-medium text-muted-foreground">
            {label}
          </Text>
        </View>
        {onPress ? (
          <Icon as={ArrowUpRight} size={16} className="text-muted-foreground" />
        ) : null}
      </View>

      <View>
        <Text className="text-4xl font-bold tracking-tight text-foreground">{value}</Text>
        {hint ? <Text className="mt-1 text-xs text-muted-foreground">{hint}</Text> : null}
      </View>
    </View>
  );

  if (!onPress) {
    return <View className="min-w-[46%] flex-1">{conteudo}</View>;
  }

  return (
    <Pressable className="min-w-[46%] flex-1" onPress={onPress}>
      {conteudo}
    </Pressable>
  );
}
