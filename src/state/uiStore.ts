/**
 * uiStore — reaktif UI durumu: aktif dil + tema + sesli yönlendirme tercihleri.
 * Dil değişince i18n kaynağını günceller; tema değişince renkler anında döner.
 * Tema/ses seçimleri KeyValueStore ile kalıcılaşır (uygulama yeniden açılınca korunur).
 */
import { create } from 'zustand';

import { getLocale, setLocale as applyLocale } from '../i18n';
import { THEMES, type ThemeColors, type ThemeName } from '../config/theme';
import { createMemoryStore, type KeyValueStore } from '../services/storage';

const THEME_KEY = 'lezzet.theme';
const VOICE_KEY = 'lezzet.voiceEnabled';
const RATE_KEY = 'lezzet.voiceRate';

export type VoiceRate = 'slow' | 'normal' | 'fast';

/** Konuşma hızı etiketini expo-speech çarpanına çevirir. */
export const VOICE_RATE_VALUE: Record<VoiceRate, number> = {
  slow: 0.85,
  normal: 1.0,
  fast: 1.15,
};

interface UiState {
  /** Aktif dil kodu (reaktif). */
  locale: string;
  /** Aktif tema. */
  theme: ThemeName;
  /** Sesli yönlendirme açık mı? */
  voiceEnabled: boolean;
  /** Konuşma hızı. */
  voiceRate: VoiceRate;
  /** Tema/ses kalıcılığı için depo. */
  store: KeyValueStore;
  /** Dili değiştir: i18n'i günceller ve abone bileşenleri yeniden render eder. */
  setLocale: (locale: string) => void;
  /** Tema deposunu bağla. */
  setThemeStore: (store: KeyValueStore) => void;
  /** Kayıtlı temayı yükle (varsa). */
  loadTheme: () => Promise<void>;
  /** Kayıtlı ses tercihlerini yükle (varsa). */
  loadVoice: () => Promise<void>;
  /** Temayı ayarla ve kalıcılaştır. */
  setTheme: (theme: ThemeName) => Promise<void>;
  /** Açık ↔ karanlık geçişi. */
  toggleTheme: () => Promise<void>;
  /** Sesli yönlendirmeyi aç/kapat ve kalıcılaştır. */
  setVoiceEnabled: (enabled: boolean) => Promise<void>;
  /** Konuşma hızını ayarla ve kalıcılaştır. */
  setVoiceRate: (rate: VoiceRate) => Promise<void>;
}

export const useUiStore = create<UiState>((set, get) => ({
  locale: getLocale(),
  theme: 'light',
  voiceEnabled: true,
  voiceRate: 'normal',
  store: createMemoryStore(),
  setLocale: (locale) => {
    applyLocale(locale);
    set({ locale: getLocale() });
  },
  setThemeStore: (store) => set({ store }),
  loadTheme: async () => {
    const raw = await get().store.getItem(THEME_KEY);
    if (raw === 'light' || raw === 'dark') set({ theme: raw });
  },
  loadVoice: async () => {
    const [enabled, rate] = await Promise.all([
      get().store.getItem(VOICE_KEY),
      get().store.getItem(RATE_KEY),
    ]);
    if (enabled === 'false') set({ voiceEnabled: false });
    if (rate === 'slow' || rate === 'normal' || rate === 'fast') set({ voiceRate: rate });
  },
  setTheme: async (theme) => {
    set({ theme });
    await get().store.setItem(THEME_KEY, theme);
  },
  toggleTheme: async () => {
    await get().setTheme(get().theme === 'light' ? 'dark' : 'light');
  },
  setVoiceEnabled: async (enabled) => {
    set({ voiceEnabled: enabled });
    await get().store.setItem(VOICE_KEY, String(enabled));
  },
  setVoiceRate: async (rate) => {
    set({ voiceRate: rate });
    await get().store.setItem(RATE_KEY, rate);
  },
}));

/** Aktif temanın renk paletini reaktif döndürür (ekranlar bununla stillenir). */
export function useThemeColors(): ThemeColors {
  return useUiStore((s) => THEMES[s.theme]);
}
