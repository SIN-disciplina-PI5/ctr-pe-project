export type TipoAtivo =
  | "MAQUINA"
  | "CAMINHAO"
  | "EQUIPAMENTO"
  | "COMPONENTE"
  | "OUTRO";

export type StatusAtivo =
  | "DISPONIVEL"
  | "EM_USO"
  | "PARADO"
  | "EM_MANUTENCAO"
  | "AGUARDANDO_PECA"
  | "DESATIVADO";

export type Criticidade = "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";

export type Ativo = {
  id: string;
  empresaId: string;
  localizacaoId?: string | null;
  codigo: string;
  nome: string;
  descricao?: string | null;
  tipo: TipoAtivo;
  status: StatusAtivo;
  criticidade: Criticidade;
  marca?: string | null;
  modelo?: string | null;
  numeroSerie?: string | null;
  placa?: string | null;
  horimetroAtual?: number | string | null;
  odometroAtual?: number | string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ListAtivosParams = {
  empresaId?: string;
  localizacaoId?: string;
  search?: string;
  status?: StatusAtivo;
  tipo?: TipoAtivo;
  criticidade?: Criticidade;
  page?: number;
  limit?: number;
};

export type CreateAtivoInput = {
  empresaId: string;
  localizacaoId?: string;
  codigo: string;
  nome: string;
  descricao?: string;
  tipo: TipoAtivo;
  status?: StatusAtivo;
  criticidade?: Criticidade;
  marca?: string;
  modelo?: string;
  numeroSerie?: string;
  placa?: string;
  horimetroAtual?: number;
  odometroAtual?: number;
  ativo?: boolean;
};

export type UpdateAtivoInput = Partial<Omit<CreateAtivoInput, "empresaId" | "status">>;

export type UpdateStatusAtivoInput = {
  status: StatusAtivo;
  motivo?: string;
};
