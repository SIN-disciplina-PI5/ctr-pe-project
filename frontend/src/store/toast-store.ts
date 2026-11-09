import { create } from "zustand";

export type ToastVariant = "success" | "error";

export type ToastItem = {
  id: number;
  variant: ToastVariant;
  title: string;
  message?: string;
};

type ToastState = {
  toasts: ToastItem[];
  show: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: number) => void;
};

const DURACAO_MS = 4000;
let nextId = 1;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (toast) => {
    const id = nextId++;
    set({ toasts: [...get().toasts, { ...toast, id }] });
    setTimeout(() => get().dismiss(id), DURACAO_MS);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

export const notify = {
  success: (title: string, message?: string) =>
    useToastStore.getState().show({ variant: "success", title, message }),
  error: (title: string, message?: string) =>
    useToastStore.getState().show({ variant: "error", title, message }),
};
