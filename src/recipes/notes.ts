/**
 * Tarife özel kullanıcı notları için saf yardımcılar (test edilebilir).
 * Kalıcılık notesStore + services/storage'da; burada veri dönüşümleri.
 * Not haritası: { recipeId -> metin }.
 */
export function parseNotes(raw: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const out: Record<string, string> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (typeof val === 'string') out[key] = val;
    }
    return out;
  } catch {
    return {};
  }
}

export function serializeNotes(notes: Record<string, string>): string {
  return JSON.stringify(notes);
}

/** Notu ayarlar; metin boşsa kaydı kaldırır (yeni harita döndürür). */
export function setNote(
  notes: Record<string, string>,
  recipeId: string,
  text: string,
): Record<string, string> {
  const next = { ...notes };
  if (text.trim()) next[recipeId] = text;
  else delete next[recipeId];
  return next;
}
