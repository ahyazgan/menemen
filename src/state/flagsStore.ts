/**
 * flagsStore — aktif özellik bayraklarını reaktif tutar. Varsayılanlar
 * config/flags.ts'te; proxy bağlıysa App remote config'i çekip applyRemote ile
 * geçer. Saf birleştirme/doğrulama sanitizeFlags'te ve testli.
 */
import { create } from 'zustand';

import { DEFAULT_FLAGS, sanitizeFlags, type FeatureFlags } from '../config/flags';

interface FlagsState {
  flags: FeatureFlags;
  /** Remote config (güvenilmez) uygula; geçersiz alanlar yok sayılır. */
  applyRemote: (raw: unknown) => void;
}

export const useFlagsStore = create<FlagsState>((set) => ({
  flags: DEFAULT_FLAGS,
  applyRemote: (raw) => set({ flags: sanitizeFlags(raw) }),
}));

/** İmperatif okuma (store/efekt içinden). */
export function getFlags(): FeatureFlags {
  return useFlagsStore.getState().flags;
}

/** Tek bir bayrağa reaktif abone olan kısayol hook. */
export function useFlag<K extends keyof FeatureFlags>(key: K): FeatureFlags[K] {
  return useFlagsStore((s) => s.flags[key]);
}
