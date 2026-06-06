import { apiClient } from "@/infrastructure/api/api-client";
import type { PerfilUsuario, Usuario } from "./usuarios.types";

export type ListUsuariosParams = {
  empresaId?: string;
  perfil?: PerfilUsuario;
  ativo?: boolean;
  search?: string;
};

export type CreateUsuarioDto = {
  empresaId: string;
  nome: string;
  email: string;
  password: string;
  perfil: PerfilUsuario;
  ativo?: boolean;
};

export type UpdateUsuarioDto = Partial<Omit<CreateUsuarioDto, "password">>;

export type ResetSenhaDto = {
  novaSenha: string;
};

export const usuariosService = {
  async list(params?: ListUsuariosParams): Promise<Usuario[]> {
    const { data } = await apiClient.get("/usuarios", { params });
    return data;
  },

  async getById(id: string): Promise<Usuario> {
    const { data } = await apiClient.get(`/usuarios/${id}`);
    return data;
  },

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const { data } = await apiClient.post("/usuarios", dto);
    return data;
  },

  async update(id: string, dto: UpdateUsuarioDto): Promise<Usuario> {
    const { data } = await apiClient.patch(`/usuarios/${id}`, dto);
    return data;
  },

  async resetSenha(id: string, dto: ResetSenhaDto): Promise<void> {
    await apiClient.patch(`/usuarios/${id}/password`, dto);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/usuarios/${id}`);
  },
};