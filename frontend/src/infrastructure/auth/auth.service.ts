import { apiClient } from "../api/api-client";
import type { Usuario } from "@/features/usuarios/usuarios.types";

export type RecaptchaPlatform = "web" | "android" | "ios";

export type LoginCredentials = {
  email: string;
  password: string;
  recaptchaToken: string;
  recaptchaPlatform: RecaptchaPlatform;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

type SignupEmpresa = {
  id: string;
  nome: string;
};

type SignUpInput = {
  nome: string;
  email: string;
  password: string;
  empresaId: string;
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post("/auth/sign-in", credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Erro ao realizar autenticação",
      );
    }
  },

  async me(): Promise<Usuario> {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Erro ao carregar usuário autenticado",
      );
    }
  },

  async listSignupEmpresas(): Promise<SignupEmpresa[]> {
    const response = await apiClient.get("/auth/sign-up/empresas");
    return response.data;
  },

  async signUp(payload: SignUpInput) {
    const response = await apiClient.post("/auth/sign-up", payload);
    return response.data;
  },

  async logout(refreshToken: string) {
    await apiClient.delete("/auth/logout", {
      data: { refreshToken },
    });
  },
};
