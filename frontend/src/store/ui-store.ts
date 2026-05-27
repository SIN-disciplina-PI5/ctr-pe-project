import { create } from "zustand";

type UiState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
