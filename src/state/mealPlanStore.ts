/**
 * mealPlanStore — haftalık menü planını reaktif tutar ve kalıcılaştırır. Plan
 * üretimi/değişimi saf mantıkta (recipes/mealPlan.ts); burada durum + kalıcılık.
 */
import { create } from 'zustand';

import { recipeList } from '../recipes';
import {
  generatePlan,
  swapDay,
  parsePlan,
  serializePlan,
  type MealPlan,
} from '../recipes/mealPlan';
import type { Profile } from '../recipes/profile';
import { createMemoryStore, type KeyValueStore } from '../services/storage';
import { track } from '../services/analytics';

const KEY = 'lezzet.mealPlan';
const DEFAULT_DAYS = 7;

interface MealPlanState {
  store: KeyValueStore;
  plan: MealPlan;
  setStore: (store: KeyValueStore) => void;
  load: () => Promise<void>;
  generate: (profile: Profile, days?: number) => Promise<void>;
  swap: (profile: Profile, day: number) => Promise<void>;
  clear: () => Promise<void>;
}

export const useMealPlanStore = create<MealPlanState>((set, get) => ({
  store: createMemoryStore(),
  plan: [],

  setStore: (store) => set({ store }),

  load: async () => {
    const raw = await get().store.getItem(KEY);
    set({ plan: parsePlan(raw) });
  },

  generate: async (profile, days = DEFAULT_DAYS) => {
    const plan = generatePlan(recipeList, profile, days);
    set({ plan });
    track({ name: 'plan_generated', days: plan.length });
    await get().store.setItem(KEY, serializePlan(plan));
  },

  swap: async (profile, day) => {
    const plan = swapDay(get().plan, recipeList, profile, day);
    set({ plan });
    await get().store.setItem(KEY, serializePlan(plan));
  },

  clear: async () => {
    set({ plan: [] });
    await get().store.setItem(KEY, serializePlan([]));
  },
}));
