import type { PerfilUsuario } from "@/features/usuarios/usuarios.types";

// Espelham as regras do backend (requireRole). Se uma regra mudar lá, mude aqui.
// Para ordens de serviço, use OS_ACTION_ROLES em "@/constants/roles".
export const PERFIS_CADASTRO: PerfilUsuario[] = ["ADMIN", "SUPERVISOR"];
export const PERFIS_EXCLUSAO: PerfilUsuario[] = ["ADMIN"];
