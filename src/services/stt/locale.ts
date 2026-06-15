/** Dil kodunu konuşma tanıyıcının beklediği BCP-47 biçimine çevirir. */
export function recognizerLocale(locale: string): string {
  if (locale.startsWith('tr')) return 'tr-TR';
  if (locale.startsWith('en')) return 'en-US';
  return locale;
}
