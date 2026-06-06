import { apiClient } from "../api/api-client";

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

  async logout() {
    return Promise.resolve();
  },
};