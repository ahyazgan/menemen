/**
 * profileStore — kişisel profili (diyet + kaçınılan malzeme + beceri) reaktif
 * tutar ve KeyValueStore ile kalıcılaştırır. Saf mantık recipes/profile.ts'te
 * ve testli; burada yalnızca durum + kalıcılık var.
 */
import { create } from 'zustand';

import {
  DEFAULT_PROFILE,
  parseProfile,
  serializeProfile,
  toggleAvoid,
  type DietPref,
  type Profile,
  type SkillLevel,
} from '../recipes/profile';
import { createMemoryStore, type KeyValueStore } from '../services/storage';

const KEY = 'lezzet.profile';

interface ProfileState {
  store: KeyValueStore;
  profile: Profile;
  setStore: (store: KeyValueStore) => void;
  load: () => Promise<void>;
  setDiet: (diet: DietPref) => Promise<void>;
  setSkill: (skill: SkillLevel) => Promise<void>;
  toggleAvoid: (key: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  store: createMemoryStore(),
  profile: DEFAULT_PROFILE,

  setStore: (store) => set({ store }),

  load: async () => {
    const raw = await get().store.getItem(KEY);
    set({ profile: parseProfile(raw) });
  },

  setDiet: async (diet) => {
    const profile = { ...get().profile, diet };
    set({ profile });
    await get().store.setItem(KEY, serializeProfile(profile));
  },

  setSkill: async (skill) => {
    const profile = { ...get().profile, skill };
    set({ profile });
    await get().store.setItem(KEY, serializeProfile(profile));
  },

  toggleAvoid: async (key) => {
    const profile = toggleAvoid(get().profile, key);
    set({ profile });
    await get().store.setItem(KEY, serializeProfile(profile));
  },
}));
