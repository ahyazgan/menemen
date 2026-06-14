/**
 * pantryStore — "elimde olan" malzemeleri reaktif tutar ve kalıcılaştırır.
 * Owned, basit bir anahtar listesidir; favorilerle aynı saf string-liste
 * yardımcılarını (recipes/favorites.ts) kullanır.
 */
import { create } from 'zustand';

import { parseFavorites, serializeFavorites, toggleFavorite } from '../recipes/favorites';
import { createMemoryStore, type KeyValueStore } from '../services/storage';

const KEY = 'lezzet.pantry';

interface PantryState {
  store: KeyValueStore;
  owned: string[];
  setStore: (store: KeyValueStore) => void;
  load: () => Promise<void>;
  toggle: (key: string) => Promise<void>;
}

export const usePantryStore = create<PantryState>((set, get) => ({
  store: createMemoryStore(),
  owned: [],

  setStore: (store) => set({ store }),

  load: async () => {
    set({ owned: parseFavorites(await get().store.getItem(KEY)) });
  },

  toggle: async (key) => {
    const owned = toggleFavorite(get().owned, key);
    set({ owned });
    await get().store.setItem(KEY, serializeFavorites(owned));
  },
}));
