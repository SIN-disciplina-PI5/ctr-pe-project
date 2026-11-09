import { Inbox, type LucideIcon } from "lucide-react-native";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  icon = Inbox,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="items-center justify-center rounded-xl border border-dashed border-border p-8">
      <Icon as={icon} size={32} className="mb-3 text-muted-foreground" />
      <Text className="text-center text-lg font-semibold">{title}</Text>
      {description ? (
        <Text className="mt-2 text-center text-muted-foreground">{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button variant="outline" className="mt-4" onPress={onAction}>
          <Text>{actionLabel}</Text>
        </Button>
      ) : null}
    </View>
  );
}
