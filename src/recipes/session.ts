/**
 * Aktif pişirme oturumu için saf yardımcılar (test edilebilir). Kalıcılık
 * cookSessionStore + services/storage'da; burada yalnızca veri dönüşümleri.
 *
 * Kullanıcı pişirme ortasında uygulamadan çıkarsa, son durum (tarif + tamamlanan
 * adımlar) burada serileştirilip saklanır; tekrar açınca "kaldığın yerden devam
 * et?" teklifi için geri yüklenir.
 */
export interface CookSession {
  recipeId: string;
  /** Tamamlanmış (done) düğüm id'leri. */
  doneIds: string[];
  /** Son güncelleme anı (ms epoch). */
  at: number;
}

export function parseSession(raw: string | null): CookSession | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const v = value as Partial<CookSession>;
    if (typeof v.recipeId !== 'string' || typeof v.at !== 'number') return null;
    const doneIds = Array.isArray(v.doneIds)
      ? v.doneIds.filter((x): x is string => typeof x === 'string')
      : [];
    return { recipeId: v.recipeId, doneIds, at: v.at };
  } catch {
    return null;
  }
}

export function serializeSession(session: CookSession): string {
  return JSON.stringify(session);
}

/** Verilen oturumun sürdürülmeye değer olup olmadığını söyler. */
export function isResumable(session: CookSession | null): session is CookSession {
  return !!session && session.doneIds.length > 0;
}
