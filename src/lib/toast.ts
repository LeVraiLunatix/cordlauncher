import { createStore, useStore } from "./store";

export type ToastTone = "ok" | "info" | "error";

export type Toast = {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
  /** Couleurs de l'app concernée, pour teinter le toast. */
  tint?: readonly [string, string];
};

const toastStore = createStore<Toast[]>([]);
const DURATION_MS = 4200;
let nextId = 1;

export function toast(t: Omit<Toast, "id">): void {
  const id = nextId++;
  toastStore.set((list) => [...list.slice(-3), { ...t, id }]);
  setTimeout(() => dismissToast(id), DURATION_MS);
}

export function dismissToast(id: number): void {
  toastStore.set((list) => list.filter((t) => t.id !== id));
}

export function useToasts(): Toast[] {
  return useStore(toastStore, (s) => s);
}
