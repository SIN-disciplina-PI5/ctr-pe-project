export type StatusParada = "ABERTA" | "ENCERRADA" | "CANCELADA";

export type ParadaAtivo = {
  id: string;
  empresaId: string;
  ativoId: string;
  ordemServicoId: string | null;
  status: StatusParada;
  inicioEm: string;
  fimEm: string | null;
  duracaoMinutos: number | null;
  motivo: string | null;
  programada: boolean;
  impactaDisponibilidade: boolean;
  createdAt: string;
  updatedAt: string;
};