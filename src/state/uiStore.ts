/**
 * uiStore — reaktif UI durumu. Şimdilik yalnızca aktif dil: değiştiğinde i18n
 * kaynağını günceller ve abone ekranları yeniden render ettirir. cookingStore'un
 * sesli metinleri çağrı anında getLocale() okuduğu için ayrıca etkilenir.
 */
import { create } from 'zustand';

import { getLocale, setLocale as applyLocale } from '../i18n';

interface UiState {
  /** Aktif dil kodu (reaktif). */
  locale: string;
  /** Dili değiştir: i18n'i günceller ve abone bileşenleri yeniden render eder. */
  setLocale: (locale: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  locale: getLocale(),
  setLocale: (locale) => {
    applyLocale(locale);
    set({ locale: getLocale() });
  },
}));
