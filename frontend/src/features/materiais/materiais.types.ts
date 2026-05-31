export type Material = {
  id: string;
  empresaId: string;
  codigo: string;
  nome: string;
  descricao?: string | null;
  unidade: string;
  estoqueAtual: number | string;
  estoqueMinimo: number | string;
  custoMedio: number | string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ListMateriaisParams = {
  empresaId?: string;
  search?: string;
  ativo?: boolean;
  estoqueBaixo?: boolean;
};

export type CreateMaterialInput = {
  empresaId: string;
  codigo: string;
  nome: string;
  descricao?: string;
  unidade?: string;
  estoqueAtual?: number;
  estoqueMinimo?: number;
  custoMedio?: number;
  ativo?: boolean;
};

export type UpdateMaterialInput = Partial<
  Omit<CreateMaterialInput, "empresaId" | "estoqueAtual">
>;

export type OperacaoEstoque = "ENTRADA" | "SAIDA" | "AJUSTE";

export type UpdateEstoqueMaterialInput = {
  operacao: OperacaoEstoque;
  quantidade?: number;
  novoEstoque?: number;
  motivo?: string;
};
