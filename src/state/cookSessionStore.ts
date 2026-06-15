/**
 * cookSessionStore — aktif pişirme oturumunu reaktif tutar ve KeyValueStore ile
 * kalıcılaştırır. Kullanıcı pişirme ortasında çıkıp dönerse "kaldığın yerden
 * devam et?" teklifi için kullanılır. Saf serileştirme recipes/session.ts'te.
 */
import { create } from 'zustand';

import { parseSession, serializeSession, type CookSession } from '../recipes/session';
import { createMemoryStore, type KeyValueStore } from '../services/storage';

const KEY = 'lezzet.cookSession';

interface CookSessionState {
  store: KeyValueStore;
  /** Sürdürülebilir kayıtlı oturum (yoksa null). */
  session: CookSession | null;
  setStore: (store: KeyValueStore) => void;
  load: () => Promise<void>;
  /** İlerlemeyi kaydet (aktif tarif + tamamlanan adımlar). */
  save: (recipeId: string, doneIds: string[]) => Promise<void>;
  /** Oturumu temizle (tarif bitti ya da kullanıcı çıktı). */
  clear: () => Promise<void>;
}

export const useCookSessionStore = create<CookSessionState>((set, get) => ({
  store: createMemoryStore(),
  session: null,

  setStore: (store) => set({ store }),

  load: async () => {
    const raw = await get().store.getItem(KEY);
    set({ session: parseSession(raw) });
  },

  save: async (recipeId, doneIds) => {
    const session: CookSession = { recipeId, doneIds, at: Date.now() };
    set({ session });
    await get().store.setItem(KEY, serializeSession(session));
  },

  clear: async () => {
    set({ session: null });
    await get().store.removeItem(KEY);
  },
}));
