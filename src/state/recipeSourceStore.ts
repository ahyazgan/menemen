/**
 * recipeSourceStore — etkin tarif listesini (paket + uzak/CMS) reaktif tutar ve
 * doğrulanmış uzak tarifleri kalıcılaştırır (offline önbellek). Paket tarifler
 * her zaman garantili tabandır; uzak içerik yalnızca yeni id ekler. Doğrulama
 * recipes/validate.ts'te (saf, testli); kayıt recipes/index.ts registry'sinde.
 *
 * CLAUDE.md: "statik tarif listesine dönüşme" — bu, içeriği uygulama
 * güncellemesi olmadan tazeleyerek tam tersini sağlar.
 */
import { create } from 'zustand';

import { allRecipes, recipeList, setRemoteRecipes } from '../recipes';
import { parseRemoteRecipes } from '../recipes/validate';
import { createMemoryStore, type KeyValueStore } from '../services/storage';
import type { Recipe } from '../engine/types';

const KEY = 'lezzet.remoteRecipes';

interface RecipeSourceState {
  store: KeyValueStore;
  /** Etkin liste (paket + uzak). Bileşenler buna abone olur. */
  list: Recipe[];
  setStore: (store: KeyValueStore) => void;
  /** Önbellekten uzak tarifleri yükle (açılış, offline). */
  load: () => Promise<void>;
  /** Uzak içeriği (güvenilmez) uygula: doğrula → kaydet → önbelleğe yaz. */
  applyRemote: (raw: unknown) => Promise<void>;
}

export const useRecipeSourceStore = create<RecipeSourceState>((set, get) => ({
  store: createMemoryStore(),
  list: recipeList,

  setStore: (store) => set({ store }),

  load: async () => {
    const raw = await get().store.getItem(KEY);
    if (!raw) return;
    try {
      const recipes = parseRemoteRecipes(JSON.parse(raw));
      setRemoteRecipes(recipes);
      set({ list: allRecipes() });
    } catch {
      // bozuk önbellek → yalnızca paket tarifler kalır
    }
  },

  applyRemote: async (raw) => {
    const recipes = parseRemoteRecipes(raw);
    if (recipes.length === 0) return;
    setRemoteRecipes(recipes);
    set({ list: allRecipes() });
    // Yalnızca doğrulanmış olanları önbelleğe yaz (offline + sonraki açılış).
    await get().store.setItem(KEY, JSON.stringify(recipes));
  },
}));
