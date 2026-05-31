import { useState } from "react";
import { View } from "react-native";

import {
  CancelarModal,
  EncerrarModal,
  IniciarModal,
  ObservacaoModal,
} from "@/components/domain/ordem-servico-modals";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  getOrdemServicoActions,
  type OrdemServicoActionKey,
} from "@/features/ordens-servico/ordens-servico.actions";
import {
  useAguardarPecaOrdemServico,
  useRetomarOrdemServico,
} from "@/features/ordens-servico/ordens-servico.hooks";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { OrdemServico } from "@/types/ordem-servico";

export function OrdemServicoActions({ ordemServico }: { ordemServico: OrdemServico }) {
  const { data: user } = useCurrentUser();
  const [openKey, setOpenKey] = useState<OrdemServicoActionKey | null>(null);

  const actions = user ? getOrdemServicoActions(ordemServico.status, user.perfil) : [];
  if (actions.length === 0) return null;

  const id = ordemServico.id;
  const close = () => setOpenKey(null);

  return (
    <View className="gap-2">
      {actions.includes("iniciar") ? (
        <Button onPress={() => setOpenKey("iniciar")}>
          <Text>Iniciar</Text>
        </Button>
      ) : null}
      {actions.includes("aguardarPeca") ? (
        <Button variant="secondary" onPress={() => setOpenKey("aguardarPeca")}>
          <Text>Aguardar peça</Text>
        </Button>
      ) : null}
      {actions.includes("retomar") ? (
        <Button onPress={() => setOpenKey("retomar")}>
          <Text>Retomar</Text>
        </Button>
      ) : null}
      {actions.includes("encerrar") ? (
        <Button onPress={() => setOpenKey("encerrar")}>
          <Text>Encerrar</Text>
        </Button>
      ) : null}
      {actions.includes("cancelar") ? (
        <Button variant="destructive" onPress={() => setOpenKey("cancelar")}>
          <Text>Cancelar O.S.</Text>
        </Button>
      ) : null}

      <IniciarModal id={id} open={openKey === "iniciar"} onClose={close} />
      <ObservacaoModal
        id={id}
        open={openKey === "aguardarPeca"}
        onClose={close}
        title="Aguardar peça"
        description="Marcar a ordem de serviço como aguardando peça."
        confirmLabel="Confirmar"
        useAction={useAguardarPecaOrdemServico}
      />
      <ObservacaoModal
        id={id}
        open={openKey === "retomar"}
        onClose={close}
        title="Retomar O.S."
        description="Retomar a execução da ordem de serviço."
        confirmLabel="Retomar"
        useAction={useRetomarOrdemServico}
      />
      <EncerrarModal id={id} open={openKey === "encerrar"} onClose={close} />
      <CancelarModal id={id} open={openKey === "cancelar"} onClose={close} />
    </View>
  );
}
