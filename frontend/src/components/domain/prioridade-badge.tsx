import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { PRIORIDADE_OS_LABEL, PRIORIDADE_OS_VARIANT } from "@/constants/status";
import type { PrioridadeOS } from "@/types/ordem-servico";

type Props = {
  prioridade: PrioridadeOS;
};

export function PrioridadeBadge({ prioridade }: Props) {
  return (
    <Badge variant={PRIORIDADE_OS_VARIANT[prioridade]}>
      <Text>{PRIORIDADE_OS_LABEL[prioridade]}</Text>
    </Badge>
  );
}
