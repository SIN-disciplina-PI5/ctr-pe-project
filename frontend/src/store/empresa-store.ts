import { create } from "zustand";

type EmpresaState = {
  empresaId: string | null;
  setEmpresaId: (empresaId: string | null) => void;
};

export const useEmpresaStore = create<EmpresaState>((set) => ({
  empresaId: null,
  setEmpresaId: (empresaId) => set({ empresaId }),
}));
