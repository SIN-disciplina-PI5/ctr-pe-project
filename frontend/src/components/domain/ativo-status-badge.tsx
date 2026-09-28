import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import type { StatusAtivo } from "@/features/ativos/ativos.types";

type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline";

const STATUS_ATIVO_LABEL: Record<StatusAtivo, string> = {
  DISPONIVEL: "Disponível",
  EM_USO: "Em uso",
  PARADO: "Parado",
  EM_MANUTENCAO: "Em manutenção",
  AGUARDANDO_PECA: "Aguardando peça",
  DESATIVADO: "Desativado",
};

const STATUS_ATIVO_VARIANT: Record<
  StatusAtivo,
  BadgeVariant
> = {
  DISPONIVEL: "default",
  EM_USO: "secondary",
  PARADO: "destructive",
  EM_MANUTENCAO: "outline",
  AGUARDANDO_PECA: "outline",
  DESATIVADO: "secondary",
};

type AtivoStatusBadgeProps = {
  status: StatusAtivo;
};

export function AtivoStatusBadge({
  status,
}: AtivoStatusBadgeProps) {
  return (
    <Badge variant={STATUS_ATIVO_VARIANT[status]}>
      <Text>{STATUS_ATIVO_LABEL[status]}</Text>
    </Badge>
  );
}