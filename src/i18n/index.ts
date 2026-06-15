/**
 * Minimal i18n. Önce TR, sonra EN (CLAUDE.md: i18n hazır). Kullanım: t('cooking.start').
 *
 * Cihaz dili tespiti için ileride expo-localization eklenip setLocale() ile
 * bağlanabilir; burada varsayılan 'tr', manuel değiştirilebilir.
 */
import { tr, type TranslationTree } from './tr';
import { en } from './en';

const locales: Record<string, TranslationTree> = { tr, en };

/** Desteklenen dil kodları. */
export const AVAILABLE_LOCALES = Object.keys(locales);

let activeLocale = 'tr';

export function setLocale(locale: string): void {
  if (locales[locale]) activeLocale = locale;
}

export function getLocale(): string {
  return activeLocale;
}

/**
 * Cihaz dil adaylarından (örn. ["en-US","tr"]) desteklenen ilk dili seçer.
 * Saf fonksiyon — cihaz tespitinden ayrı, test edilebilir. Eşleşme yoksa fallback.
 */
export function pickSupportedLocale(
  candidates: string[],
  supported: string[] = AVAILABLE_LOCALES,
  fallback = 'tr',
): string {
  const supportedLower = supported.map((s) => s.toLowerCase());
  for (const candidate of candidates) {
    if (!candidate) continue;
    const base = candidate.toLowerCase().split('-')[0];
    if (base) {
      const index = supportedLower.indexOf(base);
      if (index >= 0) return supported[index] ?? fallback;
    }
  }
  return fallback;
}

/** Nokta ayrımlı anahtarı aktif dile göre çözer; bulunamazsa anahtarı döndürür. */
export function t(path: string, params?: Record<string, string | number>): string {
  const parts = path.split('.');
  let node: unknown = locales[activeLocale];
  for (const part of parts) {
    if (node && typeof node === 'object' && part in node) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  if (typeof node !== 'string') return path;
  if (!params) return node;
  // {key} yer tutucularını değiştir (eşleşmeyenler olduğu gibi kalır).
  return node.replace(/\{(\w+)\}/g, (m, k: string) => (k in params ? String(params[k]) : m));
}
