import { env } from "@/infrastructure/env/env";
import { useEmpresaStore } from "@/store/empresa-store";

export function useSelectedEmpresaId(): string | null {
  const empresaId = useEmpresaStore((state) => state.empresaId);
  return empresaId ?? (env.devEmpresaId || null);
}
