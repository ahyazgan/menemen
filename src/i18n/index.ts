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

/** Nokta ayrımlı anahtarı aktif dile göre çözer; bulunamazsa anahtarı döndürür. */
export function t(path: string): string {
  const parts = path.split('.');
  let node: unknown = locales[activeLocale];
  for (const part of parts) {
    if (node && typeof node === 'object' && part in node) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  return typeof node === 'string' ? node : path;
}
