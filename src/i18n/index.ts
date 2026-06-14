/**
 * Minimal i18n. Şimdilik yalnızca TR; ileride EN eklenince locale seçimi burada
 * yapılır. Kullanım: t('cooking.start').
 */
import { tr, type TranslationTree } from './tr';

const locales: Record<string, TranslationTree> = { tr };
let activeLocale = 'tr';

export function setLocale(locale: string): void {
  if (locales[locale]) activeLocale = locale;
}

/** Nokta ayrımlı anahtarı çözer; bulunamazsa anahtarın kendisini döndürür. */
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
