export type StatusOS =
  | "ABERTA"
  | "EM_EXECUCAO"
  | "AGUARDANDO_PECA"
  | "ENCERRADA"
  | "CANCELADA";

export type PrioridadeOS = "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";

export type TipoOS = "CORRETIVA" | "PREVENTIVA" | "INSPECAO" | "OUTRA";

export interface OrdemServicoAtivoResumo {
  id: string;
  codigo: string;
  nome: string;
  status: string;
}

export interface OrdemServicoUsuarioResumo {
  id: string;
  nome: string;
  email: string;
}

export interface OrdemServico {
  id: string;
  empresaId: string;
  localizacaoId: string | null;
  ativoId: string;
  solicitanteId: string | null;
  responsavelId: string | null;
  numero: string;
  titulo: string;
  descricao: string;
  tipo: TipoOS;
  status: StatusOS;
  prioridade: PrioridadeOS;
  impactaDisponibilidade: boolean;
  abertaEm: string | null;
  iniciadaEm: string | null;
  encerradaEm: string | null;
  canceladaEm: string | null;
  prazoEm: string | null;
  diagnostico: string | null;
  solucao: string | null;
  observacao: string | null;
  custoMateriais: string | null;
  custoMaoObra: string | null;
  custoTotal: string | null;
  createdAt: string;
  updatedAt: string;
  ativo?: OrdemServicoAtivoResumo;
  solicitante?: OrdemServicoUsuarioResumo | null;
  responsavel?: OrdemServicoUsuarioResumo | null;
}
