import { create } from "zustand";
import type { Usuario } from "@/features/usuarios/usuarios.types";

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: Usuario | null;
  setAuth: (token: string, refreshToken: string, user: Usuario) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  setAuth: (token, refreshToken, user) => set({ token, refreshToken, user }),
  clearAuth: () => set({ token: null, refreshToken: null, user: null }),
}));