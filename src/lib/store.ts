import { useSyncExternalStore } from "react";

/**
 * Micro-store externe. Pas de Redux/Zustand : l'état partagé de l'app tient
 * en trois objets, et la progression des téléchargements change plusieurs
 * fois par seconde — un Context re-rendrait tout l'arbre à chaque tick, alors
 * qu'ici seuls les composants abonnés à la tranche concernée se re-rendent.
 */
export type Store<T> = {
  get: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
};

export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set: (next) => {
      state = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/**
 * Lit une tranche du store. Le sélecteur doit rendre une valeur STABLE
 * (primitive, ou objet déjà présent dans l'état) : un objet recréé à chaque
 * appel ferait boucler `useSyncExternalStore`.
 */
export function useStore<T, S>(store: Store<T>, selector: (state: T) => S): S {
  return useSyncExternalStore(store.subscribe, () => selector(store.get()));
}
