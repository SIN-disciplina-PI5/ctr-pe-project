import { apiClient } from "../api/api-client";
import type { Usuario } from "@/features/usuarios/usuarios.types";

type LoginCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post("/auth/sign-in", credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Erro ao realizar autenticacao");
    }
  },

  async me(): Promise<Usuario> {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Erro ao carregar usuario autenticado");
    }
  },

  async logout() {
    return Promise.resolve();
  },
};