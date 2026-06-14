/**
 * Pişirme geçmişi için saf yardımcılar (test edilebilir). Kalıcılık
 * historyStore + services/storage'da; burada yalnızca veri dönüşümleri.
 */
export interface HistoryEntry {
  recipeId: string;
  /** Tamamlanma anı (ms epoch). */
  at: number;
}

export function parseHistory(raw: string | null): HistoryEntry[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter(
      (x): x is HistoryEntry =>
        !!x &&
        typeof (x as HistoryEntry).recipeId === 'string' &&
        typeof (x as HistoryEntry).at === 'number',
    );
  } catch {
    return [];
  }
}

export function serializeHistory(entries: HistoryEntry[]): string {
  return JSON.stringify(entries);
}

/**
 * Bir tarifi geçmişin başına ekler. Aynı tarif zaten varsa eski kaydı kaldırır
 * (yinelenme yok), liste `max` ile sınırlanır (en yeniler kalır).
 */
export function recordHistory(
  entries: HistoryEntry[],
  recipeId: string,
  at: number,
  max = 20,
): HistoryEntry[] {
  const withoutDup = entries.filter((e) => e.recipeId !== recipeId);
  return [{ recipeId, at }, ...withoutDup].slice(0, max);
}
