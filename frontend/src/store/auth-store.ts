import { create } from "zustand";
import type { Usuario } from "@/features/usuarios/usuarios.types";

type AuthState = {
  token: string | null;
  user: Usuario | null;
  setAuth: (token: string, user: Usuario) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  clearAuth: () => set({ token: null, user: null }),
}));