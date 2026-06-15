/**
 * streakStore — pişirme günlerini (UTC gün numaraları) reaktif tutar ve
 * KeyValueStore ile kalıcılaştırır. Saf seri hesabı recipes/streak.ts'te ve
 * testli. Her tamamlanan yemekte record(now) çağrılır.
 */
import { create } from 'zustand';

import { recordCookDay, toDayNumber } from '../recipes/streak';
import { createMemoryStore, type KeyValueStore } from '../services/storage';

const KEY = 'lezzet.cookDays';

function parseDays(raw: string | null): number[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter((x): x is number => typeof x === 'number' && Number.isFinite(x));
  } catch {
    return [];
  }
}

interface StreakState {
  store: KeyValueStore;
  /** Pişirme yapılan UTC gün numaraları (artan sıralı). */
  days: number[];
  setStore: (store: KeyValueStore) => void;
  load: () => Promise<void>;
  /** Bir pişirme gününü kaydet (varsayılan: şimdi). */
  record: (at?: number) => Promise<void>;
}

export const useStreakStore = create<StreakState>((set, get) => ({
  store: createMemoryStore(),
  days: [],

  setStore: (store) => set({ store }),

  load: async () => {
    set({ days: parseDays(await get().store.getItem(KEY)) });
  },

  record: async (at = Date.now()) => {
    const days = recordCookDay(get().days, toDayNumber(at));
    if (days.length === get().days.length) return; // bugün zaten kayıtlı
    set({ days });
    await get().store.setItem(KEY, JSON.stringify(days));
  },
}));
