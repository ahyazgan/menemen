/**
 * historyStore — pişirme geçmişini reaktif tutar ve KeyValueStore ile
 * kalıcılaştırır. Saf liste mantığı recipes/history.ts'te ve testli.
 */
import { create } from 'zustand';

import {
  parseHistory,
  recordHistory,
  serializeHistory,
  type HistoryEntry,
} from '../recipes/history';
import { createMemoryStore, type KeyValueStore } from '../services/storage';
import { track } from '../services/analytics';
import { useReviewStore } from './reviewStore';

const KEY = 'lezzet.history';

interface HistoryState {
  store: KeyValueStore;
  entries: HistoryEntry[];
  setStore: (store: KeyValueStore) => void;
  load: () => Promise<void>;
  /** Bir tarifi tamamlanmış olarak kaydet. */
  record: (recipeId: string) => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  store: createMemoryStore(),
  entries: [],

  setStore: (store) => set({ store }),

  load: async () => {
    const raw = await get().store.getItem(KEY);
    set({ entries: parseHistory(raw) });
  },

  record: async (recipeId) => {
    // Aktivasyon: daha önce hiç tamamlanmış yemek yoksa bu İLK pişirme.
    const isFirstEver = get().entries.length === 0;
    const entries = recordHistory(get().entries, recipeId, Date.now());
    set({ entries });
    track({ name: 'recipe_completed', recipeId });
    if (isFirstEver) track({ name: 'first_cook_completed', recipeId });
    await get().store.setItem(KEY, serializeHistory(entries));
    // "Aha anından" sonra mağaza puanı iste (sayı kesinleştikten sonra).
    const totalCompletions = entries.reduce((n, e) => n + e.count, 0);
    void useReviewStore.getState().maybeRequest(totalCompletions);
  },
}));
