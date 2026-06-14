/**
 * Adım fotoğrafları — saf harita mantığı (React/Expo importu YOK, test edilebilir).
 * Kullanıcı bir pişirme adımına kendi fotoğrafını ekleyebilir (örn. "kıvam buydu").
 * Yapı: recipeId → (nodeId → fotoğraf URI'si). Depoya JSON olarak serileştirilir.
 */

/** Bir tarifin adım→URI eşlemesi. */
export type RecipePhotos = Record<string, string>;
/** Tüm tarifler için adım fotoğrafları. */
export type StepPhotos = Record<string, RecipePhotos>;

/** Depodan okunan ham JSON'u güvenle çözer (bozuksa boş döner). */
export function parseStepPhotos(raw: string | null): StepPhotos {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object') return {};
    const out: StepPhotos = {};
    for (const [recipeId, photos] of Object.entries(data as Record<string, unknown>)) {
      if (!photos || typeof photos !== 'object') continue;
      const inner: RecipePhotos = {};
      for (const [nodeId, uri] of Object.entries(photos as Record<string, unknown>)) {
        if (typeof uri === 'string' && uri.length > 0) inner[nodeId] = uri;
      }
      if (Object.keys(inner).length > 0) out[recipeId] = inner;
    }
    return out;
  } catch {
    return {};
  }
}

/** Haritayı depoya yazmak için JSON'a çevirir. */
export function serializeStepPhotos(map: StepPhotos): string {
  return JSON.stringify(map);
}

/** Bir adıma fotoğraf ekler/günceller (yeni harita döner; girdi değişmez). */
export function setStepPhoto(
  map: StepPhotos,
  recipeId: string,
  nodeId: string,
  uri: string,
): StepPhotos {
  return { ...map, [recipeId]: { ...(map[recipeId] ?? {}), [nodeId]: uri } };
}

/** Bir adımın fotoğrafını siler (yeni harita döner; boşalan tarif anahtarı düşer). */
export function removeStepPhoto(map: StepPhotos, recipeId: string, nodeId: string): StepPhotos {
  const current = map[recipeId];
  if (!current || !(nodeId in current)) return map;
  const inner: RecipePhotos = { ...current };
  delete inner[nodeId];
  const next: StepPhotos = { ...map };
  if (Object.keys(inner).length === 0) delete next[recipeId];
  else next[recipeId] = inner;
  return next;
}

/** Bir adımın fotoğraf URI'sini döner (yoksa undefined). */
export function getStepPhoto(
  map: StepPhotos,
  recipeId: string,
  nodeId: string,
): string | undefined {
  return map[recipeId]?.[nodeId];
}
