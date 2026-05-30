import { apiClient } from "@/infrastructure/api/api-client";

export type Localizacao = {
  id: string;
  empresaId: string;
  codigo: string | null;
  nome: string;
  tipo: string | null;
  ativa: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateLocalizacaoDto = {
  empresaId: string;
  codigo?: string;
  nome: string;
  tipo?: string;
  ativa?: boolean;
};

export type UpdateLocalizacaoDto = Partial<Omit<CreateLocalizacaoDto, "empresaId">>;

export type ListLocalizacoesParams = {
  empresaId?: string;
  search?: string;
  ativa?: boolean;
};

export const localizacoesService = {
  async list(params?: ListLocalizacoesParams): Promise<Localizacao[]> {
    const { data } = await apiClient.get("/localizacoes", { params });
    return data;
  },

  async getById(id: string): Promise<Localizacao> {
    const { data } = await apiClient.get(`/localizacoes/${id}`);
    return data;
  },

  async create(dto: CreateLocalizacaoDto): Promise<Localizacao> {
    const { data } = await apiClient.post("/localizacoes", dto);
    return data;
  },

  async update(id: string, dto: UpdateLocalizacaoDto): Promise<Localizacao> {
    const { data } = await apiClient.patch(`/localizacoes/${id}`, dto);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/localizacoes/${id}`);
  },
};