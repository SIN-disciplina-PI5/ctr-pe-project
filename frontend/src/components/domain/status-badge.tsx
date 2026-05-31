import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { STATUS_OS_LABEL, STATUS_OS_VARIANT } from "@/constants/status";
import type { StatusOS } from "@/types/ordem-servico";

type Props = {
  status: StatusOS;
};

export function StatusBadge({ status }: Props) {
  return (
    <Badge variant={STATUS_OS_VARIANT[status]}>
      <Text>{STATUS_OS_LABEL[status]}</Text>
    </Badge>
  );
}
