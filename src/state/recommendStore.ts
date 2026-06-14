/**
 * recommendStore — "Sana özel tarif öner" durumu. Öneri servisini (mock ya da
 * Claude) çağırır, sonucu ve yükleniyor durumunu tutar. Saf sıralama recommend.ts'te.
 */
import { create } from 'zustand';

import {
  createMockRecommend,
  type RecommendInput,
  type RecommendResult,
  type RecommendService,
} from '../services/recommend';

interface RecommendState {
  service: RecommendService;
  loading: boolean;
  result: RecommendResult | null;
  setService: (service: RecommendService) => void;
  suggest: (input: RecommendInput) => Promise<void>;
  reset: () => void;
}

export const useRecommendStore = create<RecommendState>((set, get) => ({
  service: createMockRecommend(),
  loading: false,
  result: null,

  setService: (service) => set({ service }),

  suggest: async (input) => {
    set({ loading: true });
    try {
      const result = await get().service.suggest(input);
      set({ result, loading: false });
    } catch {
      set({ result: { recipeId: null }, loading: false });
    }
  },

  reset: () => set({ result: null, loading: false }),
}));
