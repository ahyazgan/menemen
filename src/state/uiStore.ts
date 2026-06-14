/**
 * uiStore — reaktif UI durumu: aktif dil + tema (açık/karanlık). Dil değişince
 * i18n kaynağını günceller; tema değişince renkler tüm ekranlarda anında döner.
 * Tema seçimi KeyValueStore ile kalıcılaşır (uygulama yeniden açılınca korunur).
 */
import { create } from 'zustand';

import { getLocale, setLocale as applyLocale } from '../i18n';
import { THEMES, type ThemeColors, type ThemeName } from '../config/theme';
import { createMemoryStore, type KeyValueStore } from '../services/storage';

const THEME_KEY = 'lezzet.theme';

interface UiState {
  /** Aktif dil kodu (reaktif). */
  locale: string;
  /** Aktif tema. */
  theme: ThemeName;
  /** Tema kalıcılığı için depo. */
  store: KeyValueStore;
  /** Dili değiştir: i18n'i günceller ve abone bileşenleri yeniden render eder. */
  setLocale: (locale: string) => void;
  /** Tema deposunu bağla. */
  setThemeStore: (store: KeyValueStore) => void;
  /** Kayıtlı temayı yükle (varsa). */
  loadTheme: () => Promise<void>;
  /** Temayı ayarla ve kalıcılaştır. */
  setTheme: (theme: ThemeName) => Promise<void>;
  /** Açık ↔ karanlık geçişi. */
  toggleTheme: () => Promise<void>;
}

export const useUiStore = create<UiState>((set, get) => ({
  locale: getLocale(),
  theme: 'light',
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
  setTheme: async (theme) => {
    set({ theme });
    await get().store.setItem(THEME_KEY, theme);
  },
  toggleTheme: async () => {
    await get().setTheme(get().theme === 'light' ? 'dark' : 'light');
  },
}));

/** Aktif temanın renk paletini reaktif döndürür (ekranlar bununla stillenir). */
export function useThemeColors(): ThemeColors {
  return useUiStore((s) => THEMES[s.theme]);
}
