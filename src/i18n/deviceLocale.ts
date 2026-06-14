/**
 * Cihaz dili tespiti (native) — expo-localization sarmalayıcısı. Saf seçim
 * mantığı (pickSupportedLocale) index.ts'tedir; burada yalnızca cihazdan okuyup
 * uygulanır. App açılışta initLocaleFromDevice() çağırır.
 */
import { getLocales } from 'expo-localization';

import { AVAILABLE_LOCALES, pickSupportedLocale, setLocale } from './index';

/** Cihazın tercih ettiği, desteklenen dili döndürür (yoksa fallback). */
export function detectDeviceLocale(fallback = 'tr'): string {
  const codes = getLocales()
    .map((locale) => locale.languageCode ?? '')
    .filter((code) => code.length > 0);
  return pickSupportedLocale(codes, AVAILABLE_LOCALES, fallback);
}

/** Cihaz dilini tespit edip aktif dile uygular; seçilen dili döndürür. */
export function initLocaleFromDevice(fallback = 'tr'): string {
  const locale = detectDeviceLocale(fallback);
  setLocale(locale);
  return locale;
}
