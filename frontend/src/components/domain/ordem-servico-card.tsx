import { Pressable, View } from "react-native";

import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { PrioridadeBadge } from "@/components/domain/prioridade-badge";
import { StatusBadge } from "@/components/domain/status-badge";
import { TIPO_OS_LABEL } from "@/constants/status";
import type { OrdemServico } from "@/types/ordem-servico";

type Props = {
  ordemServico: OrdemServico;
  onPress?: () => void;
};

export function OrdemServicoCard({ ordemServico, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="mb-3">
      <Card>
        <CardContent className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text variant="small" className="text-muted-foreground">
              {ordemServico.numero}
            </Text>
            <StatusBadge status={ordemServico.status} />
          </View>

          <Text variant="large">{ordemServico.titulo}</Text>

          {ordemServico.ativo ? (
            <Text variant="muted">
              {ordemServico.ativo.codigo} · {ordemServico.ativo.nome}
            </Text>
          ) : null}

          <View className="flex-row items-center justify-between pt-1">
            <PrioridadeBadge prioridade={ordemServico.prioridade} />
            <Text variant="muted">{TIPO_OS_LABEL[ordemServico.tipo]}</Text>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}
