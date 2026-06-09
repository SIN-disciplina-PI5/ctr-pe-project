import { apiClient } from "../api/api-client";
import type { Usuario, PerfilUsuario } from "@/features/usuarios/usuarios.types";

type LoginCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

type SignupEmpresa = {
  id: string;
  nome: string;
};

type SignUpTestingInput = {
  nome: string;
  email: string;
  password: string;
  empresaId: string;
  perfil: PerfilUsuario;
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post("/auth/sign-in", credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Erro ao realizar autenticação");
    }
  },

  async me(): Promise<Usuario> {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Erro ao carregar usuário autenticado");
    }
  },

  async listSignupEmpresas(): Promise<SignupEmpresa[]> {
    const response = await apiClient.get("/auth/sign-up/empresas");
    return response.data;
  },

  async signUpTesting(payload: SignUpTestingInput) {
    const response = await apiClient.post("/auth/sign-up-testing", payload);
    return response.data;
  },

  async logout(refreshToken: string) {
    await apiClient.delete("/auth/logout", {
      data: { refreshToken },
    });
  },
};