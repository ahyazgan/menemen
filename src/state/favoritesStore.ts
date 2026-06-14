/**
 * favoritesStore — favori tarif id'lerini reaktif tutar ve KeyValueStore ile
 * kalıcılaştırır. Saf liste mantığı recipes/favorites.ts'te ve testli.
 */
import { create } from 'zustand';

import { parseFavorites, serializeFavorites, toggleFavorite } from '../recipes/favorites';
import { createMemoryStore, type KeyValueStore } from '../services/storage';

const KEY = 'lezzet.favorites';

interface FavoritesState {
  store: KeyValueStore;
  ids: string[];
  /** Kalıcı depoyu değiştir (mock → AsyncStorage). */
  setStore: (store: KeyValueStore) => void;
  /** Depodan favorileri yükle. */
  load: () => Promise<void>;
  /** Bir tarifi favorilere ekle/çıkar ve kalıcılaştır. */
  toggle: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  store: createMemoryStore(),
  ids: [],

  setStore: (store) => set({ store }),

  load: async () => {
    const raw = await get().store.getItem(KEY);
    set({ ids: parseFavorites(raw) });
  },

  toggle: async (id) => {
    const ids = toggleFavorite(get().ids, id);
    set({ ids });
    await get().store.setItem(KEY, serializeFavorites(ids));
  },

  isFavorite: (id) => get().ids.includes(id),
}));
