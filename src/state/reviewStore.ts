/**
 * reviewStore — mağaza puanı isteğini yönetir ve "hangi sürümde soruldu"yu
 * kalıcılaştırır. Saf kapı mantığı recipes/review.ts'te ve testli. Yemek
 * tamamlandığında maybeRequest(totalCompletions) çağrılır.
 */
import { create } from 'zustand';

import { shouldRequestReview } from '../recipes/review';
import { createMockReview, type ReviewService } from '../services/review';
import { createMemoryStore, type KeyValueStore } from '../services/storage';
import { getFlags } from './flagsStore';
import { track } from '../services/analytics';
import { APP_VERSION } from '../config';

const KEY = 'lezzet.reviewedVersion';

interface ReviewState {
  store: KeyValueStore;
  service: ReviewService;
  /** Puan istenen son sürüm (yoksa null). */
  promptedVersion: string | null;
  setStore: (store: KeyValueStore) => void;
  setService: (service: ReviewService) => void;
  load: () => Promise<void>;
  /** Uygunsa yerel puan akışını aç (flag + kapı + cihaz uygunluğu kontrolü). */
  maybeRequest: (completedCount: number) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  store: createMemoryStore(),
  service: createMockReview(),
  promptedVersion: null,

  setStore: (store) => set({ store }),
  setService: (service) => set({ service }),

  load: async () => {
    set({ promptedVersion: await get().store.getItem(KEY) });
  },

  maybeRequest: async (completedCount) => {
    if (!getFlags().reviewPrompt) return;
    if (
      !shouldRequestReview({
        completedCookCount: completedCount,
        lastPromptedVersion: get().promptedVersion,
        currentVersion: APP_VERSION,
      })
    ) {
      return;
    }
    if (!(await get().service.isAvailable())) return;
    await get().service.request();
    set({ promptedVersion: APP_VERSION });
    track({ name: 'review_prompted' });
    await get().store.setItem(KEY, APP_VERSION);
  },
}));
