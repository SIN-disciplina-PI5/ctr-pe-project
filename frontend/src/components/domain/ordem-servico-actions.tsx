import { useState } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  getOrdemServicoActions,
  type OrdemServicoActionKey,
} from "@/features/ordens-servico/ordens-servico.actions";
import {
  useAguardarPecaOrdemServico,
  useCancelarOrdemServico,
  useEncerrarOrdemServico,
  useIniciarOrdemServico,
  useRetomarOrdemServico,
} from "@/features/ordens-servico/ordens-servico.hooks";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { OrdemServico } from "@/types/ordem-servico";

type ModalProps = {
  id: string;
  open: boolean;
  onClose: () => void;
};

function IniciarModal({ id, open, onClose }: ModalProps) {
  const mutation = useIniciarOrdemServico(id);
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Iniciar O.S.</DialogTitle>
          <DialogDescription>
            Confirmar o início da execução desta ordem de serviço?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onPress={onClose}>
            <Text>Voltar</Text>
          </Button>
          <Button
            disabled={mutation.isPending}
            onPress={() => mutation.mutate(undefined, { onSuccess: onClose })}
          >
            <Text>{mutation.isPending ? "Iniciando…" : "Iniciar"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ObservacaoModal({
  id,
  open,
  onClose,
  title,
  description,
  confirmLabel,
  useAction,
}: ModalProps & {
  title: string;
  description: string;
  confirmLabel: string;
  useAction:
    | typeof useAguardarPecaOrdemServico
    | typeof useRetomarOrdemServico;
}) {
  const mutation = useAction(id);
  const [observacao, setObservacao] = useState("");

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Observação (opcional)"
          multiline
          className="h-20"
          value={observacao}
          onChangeText={setObservacao}
        />
        <DialogFooter>
          <Button variant="outline" onPress={onClose}>
            <Text>Voltar</Text>
          </Button>
          <Button
            disabled={mutation.isPending}
            onPress={() =>
              mutation.mutate(
                observacao.trim() ? { observacao: observacao.trim() } : {},
                { onSuccess: onClose },
              )
            }
          >
            <Text>{mutation.isPending ? "Salvando…" : confirmLabel}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EncerrarModal({ id, open, onClose }: ModalProps) {
  const mutation = useEncerrarOrdemServico(id);
  const [diagnostico, setDiagnostico] = useState("");
  const [solucao, setSolucao] = useState("");

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Encerrar O.S.</DialogTitle>
          <DialogDescription>
            Registre o diagnóstico e a solução para encerrar.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Diagnóstico"
          multiline
          className="h-20"
          value={diagnostico}
          onChangeText={setDiagnostico}
        />
        <Input
          placeholder="Solução"
          multiline
          className="h-20"
          value={solucao}
          onChangeText={setSolucao}
        />
        <DialogFooter>
          <Button variant="outline" onPress={onClose}>
            <Text>Voltar</Text>
          </Button>
          <Button
            disabled={mutation.isPending}
            onPress={() =>
              mutation.mutate(
                {
                  ...(diagnostico.trim() ? { diagnostico: diagnostico.trim() } : {}),
                  ...(solucao.trim() ? { solucao: solucao.trim() } : {}),
                },
                { onSuccess: onClose },
              )
            }
          >
            <Text>{mutation.isPending ? "Encerrando…" : "Encerrar"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CancelarModal({ id, open, onClose }: ModalProps) {
  const mutation = useCancelarOrdemServico(id);
  const [motivo, setMotivo] = useState("");

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar O.S.</DialogTitle>
          <DialogDescription>
            Esta ação cancela a ordem de serviço. Informe o motivo.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Motivo"
          multiline
          className="h-20"
          value={motivo}
          onChangeText={setMotivo}
        />
        <DialogFooter>
          <Button variant="outline" onPress={onClose}>
            <Text>Voltar</Text>
          </Button>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            onPress={() =>
              mutation.mutate(motivo.trim() ? { motivo: motivo.trim() } : {}, {
                onSuccess: onClose,
              })
            }
          >
            <Text>{mutation.isPending ? "Cancelando…" : "Cancelar O.S."}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function OrdemServicoActions({
  ordemServico,
}: {
  ordemServico: OrdemServico;
}) {
  const { perfil } = useCurrentUser();
  const [openKey, setOpenKey] = useState<OrdemServicoActionKey | null>(null);

  const actions = getOrdemServicoActions(ordemServico.status, perfil);
  if (actions.length === 0) {
    return null;
  }

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
