import { useState } from "react";

import { ActionDialog } from "@/components/domain/action-dialog";
import { Input } from "@/components/ui/input";
import {
  useAguardarPecaOrdemServico,
  useCancelarOrdemServico,
  useEncerrarOrdemServico,
  useIniciarOrdemServico,
  useRetomarOrdemServico,
} from "@/features/ordens-servico/ordens-servico.hooks";

export type ModalProps = { id: string; open: boolean; onClose: () => void };

export function IniciarModal({ id, open, onClose }: ModalProps) {
  const mutation = useIniciarOrdemServico(id);
  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      title="Iniciar O.S."
      description="Confirmar o início da execução desta ordem de serviço?"
      confirmLabel="Iniciar"
      isPending={mutation.isPending}
      onConfirm={() => mutation.mutate(undefined, { onSuccess: onClose })}
    />
  );
}

export function ObservacaoModal({
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
  useAction: typeof useAguardarPecaOrdemServico | typeof useRetomarOrdemServico;
}) {
  const mutation = useAction(id);
  const [observacao, setObservacao] = useState("");
  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      isPending={mutation.isPending}
      onConfirm={() =>
        mutation.mutate(observacao.trim() ? { observacao: observacao.trim() } : {}, {
          onSuccess: onClose,
        })
      }
    >
      <Input
        placeholder="Observação (opcional)"
        multiline
        className="h-20"
        value={observacao}
        onChangeText={setObservacao}
      />
    </ActionDialog>
  );
}

export function EncerrarModal({ id, open, onClose }: ModalProps) {
  const mutation = useEncerrarOrdemServico(id);
  const [diagnostico, setDiagnostico] = useState("");
  const [solucao, setSolucao] = useState("");
  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      title="Encerrar O.S."
      description="Registre o diagnóstico e a solução para encerrar."
      confirmLabel="Encerrar"
      isPending={mutation.isPending}
      onConfirm={() =>
        mutation.mutate(
          {
            ...(diagnostico.trim() ? { diagnostico: diagnostico.trim() } : {}),
            ...(solucao.trim() ? { solucao: solucao.trim() } : {}),
          },
          { onSuccess: onClose },
        )
      }
    >
      <Input placeholder="Diagnóstico" multiline className="h-20" value={diagnostico} onChangeText={setDiagnostico} />
      <Input placeholder="Solução" multiline className="h-20" value={solucao} onChangeText={setSolucao} />
    </ActionDialog>
  );
}

export function CancelarModal({ id, open, onClose }: ModalProps) {
  const mutation = useCancelarOrdemServico(id);
  const [motivo, setMotivo] = useState("");
  return (
    <ActionDialog
      open={open}
      onClose={onClose}
      title="Cancelar O.S."
      description="Esta ação cancela a ordem de serviço. Informe o motivo."
      confirmLabel="Cancelar O.S."
      destructive
      isPending={mutation.isPending}
      onConfirm={() =>
        mutation.mutate(motivo.trim() ? { motivo: motivo.trim() } : {}, { onSuccess: onClose })
      }
    >
      <Input placeholder="Motivo" multiline className="h-20" value={motivo} onChangeText={setMotivo} />
    </ActionDialog>
  );
}
