import { useMutation } from '@tanstack/react-query';
import { authService } from '../../infrastructure/auth/auth.service';


export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return authService.login(credentials);
    },
    onSuccess: (data) => {
      console.log('Login realizado com sucesso:', data);
    },
    onError: (error: any) => {
      console.error('Erro na mutação de login:', error.message);
    },
  });
};


export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      return authService.logout();
    },
    onSuccess: () => {
      console.log('Logout realizado com sucesso');
    },
  });
};
