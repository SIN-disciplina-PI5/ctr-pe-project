import { apiClient } from '../api/api-client';
import { ENDPOINTS } from '../api/endpoints';

export const authService = {
 
  async login(credentials: { email: string; senha?: string }) {
    try {

        const endpoint = ENDPOINTS?.login || '/auth/login';
      const response = await apiClient.post(endpoint, credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao realizar autenticação');
    }
  },


  async logout() {
    return Promise.resolve();
  }
};