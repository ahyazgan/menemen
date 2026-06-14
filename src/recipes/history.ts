/**
 * Pişirme geçmişi için saf yardımcılar (test edilebilir). Kalıcılık
 * historyStore + services/storage'da; burada yalnızca veri dönüşümleri.
 */
export interface HistoryEntry {
  recipeId: string;
  /** Son tamamlanma anı (ms epoch). */
  at: number;
  /** Bu tarifin toplam kaç kez pişirildiği. */
  count: number;
}

export function parseHistory(raw: string | null): HistoryEntry[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value
      .filter(
        (x): x is { recipeId: string; at: number; count?: number } =>
          !!x &&
          typeof (x as HistoryEntry).recipeId === 'string' &&
          typeof (x as HistoryEntry).at === 'number',
      )
      .map((x) => ({
        recipeId: x.recipeId,
        at: x.at,
        count: typeof x.count === 'number' ? x.count : 1,
      }));
  } catch {
    return [];
  }
}

export function serializeHistory(entries: HistoryEntry[]): string {
  return JSON.stringify(entries);
}

/**
 * Bir tarifi geçmişin başına ekler ve sayacını artırır. Aynı tarif varsa eski
 * kaydı kaldırır (yinelenme yok) ama sayacı korur; liste `max` ile sınırlanır.
 */
export function recordHistory(
  entries: HistoryEntry[],
  recipeId: string,
  at: number,
  max = 20,
): HistoryEntry[] {
  const existing = entries.find((e) => e.recipeId === recipeId);
  const count = (existing?.count ?? 0) + 1;
  const withoutDup = entries.filter((e) => e.recipeId !== recipeId);
  return [{ recipeId, at, count }, ...withoutDup].slice(0, max);
}

/** recipeId → toplam pişirme sayısı eşlemesi. */
export function cookCounts(entries: HistoryEntry[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const e of entries) map[e.recipeId] = e.count;
  return map;
}
