/**
 * Favori tarif id listesi için saf yardımcılar (testlenebilir). Kalıcılık
 * services/storage'da; burada yalnızca ayrıştırma/serileştirme/değiştirme.
 */

/** Depodan okunan JSON'u güvenli biçimde id listesine çevirir. */
export function parseFavorites(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter((x): x is string => typeof x === 'string');
  } catch {
    return [];
  }
}

/** Listeyi depoya yazmak için serileştirir. */
export function serializeFavorites(ids: string[]): string {
  return JSON.stringify(ids);
}

/** id favorilerdeyse çıkarır, değilse ekler (yeni liste döndürür). */
export function toggleFavorite(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}
