import { apiClient } from "@/infrastructure/api/api-client";

export type Empresa = {
  id: string;
  codigo: string | null;
  nome: string;
  ativa: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateEmpresaDto = {
  codigo?: string;
  nome: string;
  ativa?: boolean;
};

export type UpdateEmpresaDto = Partial<CreateEmpresaDto>;

export type ListEmpresasParams = {
  search?: string;
  ativa?: boolean;
};

export const empresasService = {
  async list(params?: ListEmpresasParams): Promise<Empresa[]> {
    const { data } = await apiClient.get("/empresas", { params });
    return data;
  },

  async getById(id: string): Promise<Empresa> {
    const { data } = await apiClient.get(`/empresas/${id}`);
    return data;
  },

  async create(dto: CreateEmpresaDto): Promise<Empresa> {
    const { data } = await apiClient.post("/empresas", dto);
    return data;
  },

  async update(id: string, dto: UpdateEmpresaDto): Promise<Empresa> {
    const { data } = await apiClient.patch(`/empresas/${id}`, dto);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/empresas/${id}`);
  },
};