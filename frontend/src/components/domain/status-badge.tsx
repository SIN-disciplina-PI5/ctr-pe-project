import { Text } from "@/components/ui/text";

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Text className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
      {status}
    </Text>
  );
}
