import { Text } from "@/components/ui/text";

type CriticidadeBadgeProps = {
  criticidade: string;
};

export function CriticidadeBadge({ criticidade }: CriticidadeBadgeProps) {
  return (
    <Text className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
      {criticidade}
    </Text>
  );
}
