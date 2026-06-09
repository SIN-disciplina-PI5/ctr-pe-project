export type ApontamentoOS = {
  id: string;
  ordemServicoId: string;
  usuarioId: string;
  inicioEm: string;
  fimEm: string | null;
  duracaoMinutos: number | null;
  descricao: string | null;
  custoHora: string | null;
  custoTotal: string | null;
  createdAt: string;
  updatedAt: string;
  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
};

export type CreateApontamentoOSInput = {
  inicioEm: string;
  descricao?: string;
  custoHora?: number;
};

export type UpdateApontamentoOSInput = {
  inicioEm?: string;
  descricao?: string;
  custoHora?: number;
};

export type EncerrarApontamentoOSInput = {
  fimEm?: string;
};