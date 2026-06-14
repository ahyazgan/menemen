/**
 * Çok dilli metni aktif dile çözer (saf — platformdan/i18n'den bağımsız).
 * - string → olduğu gibi (tüm dillerde aynı)
 * - { tr, en, ... } → locale, yoksa fallback, yoksa ilk değer
 */
import type { LocalizedText } from './types';

export function localize(
  text: LocalizedText | undefined,
  locale: string,
  fallback = 'tr',
): string {
  if (text == null) return '';
  if (typeof text === 'string') return text;
  return text[locale] ?? text[fallback] ?? Object.values(text)[0] ?? '';
}
