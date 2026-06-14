/**
 * onboardingStore — ilk açılış akışının görülüp görülmediğini kalıcı tutar.
 * `loaded` çözülene kadar App nötr ekran gösterir (dönen kullanıcıya onboarding
 * bir kare bile görünmesin diye).
 */
import { create } from 'zustand';

import { createMemoryStore, type KeyValueStore } from '../services/storage';
import { track } from '../services/analytics';

const KEY = 'lezzet.onboarded';

interface OnboardingState {
  store: KeyValueStore;
  /** Kalıcı değer okundu mu? */
  loaded: boolean;
  /** Onboarding tamamlandı mı? */
  seen: boolean;
  setStore: (store: KeyValueStore) => void;
  load: () => Promise<void>;
  complete: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  store: createMemoryStore(),
  loaded: false,
  seen: false,

  setStore: (store) => set({ store }),

  load: async () => {
    const raw = await get().store.getItem(KEY);
    set({ seen: raw === 'true', loaded: true });
  },

  complete: async () => {
    set({ seen: true });
    track({ name: 'onboarding_completed' });
    await get().store.setItem(KEY, 'true');
  },
}));
