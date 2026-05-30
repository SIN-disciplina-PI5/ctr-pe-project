import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  usuariosService,
  type CreateUsuarioDto,
  type ListUsuariosParams,
  type ResetSenhaDto,
  type UpdateUsuarioDto,
} from "./usuarios.service";

export const USUARIOS_QUERY_KEY = "usuarios";

export function useUsuarios(params?: ListUsuariosParams) {
  return useQuery({
    queryKey: [USUARIOS_QUERY_KEY, params],
    queryFn: () => usuariosService.list(params),
  });
}

export function useUsuario(id: string) {
  return useQuery({
    queryKey: [USUARIOS_QUERY_KEY, id],
    queryFn: () => usuariosService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateUsuarioDto) => usuariosService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USUARIOS_QUERY_KEY] });
    },
  });
}

export function useUpdateUsuario(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateUsuarioDto) => usuariosService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USUARIOS_QUERY_KEY] });
    },
  });
}

export function useResetSenha(id: string) {
  return useMutation({
    mutationFn: (dto: ResetSenhaDto) => usuariosService.resetSenha(id, dto),
  });
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usuariosService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USUARIOS_QUERY_KEY] });
    },
  });
}