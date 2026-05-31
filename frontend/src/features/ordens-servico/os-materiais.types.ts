export type StatusMaterialOS = "SOLICITADO" | "CONSUMIDO" | "DEVOLVIDO" | "CANCELADO";

export type OrdemServicoMaterial = {
  id: string;
  ordemServicoId: string;
  materialId: string;
  quantidade: number;
  custoUnitario: number;
  custoTotal: number;
  status: StatusMaterialOS;
  createdAt: string;
  updatedAt: string;
  material?: {
    id: string;
    nome: string;
    codigo: string | null;
    unidade: string | null;
  };
};