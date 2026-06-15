/**
 * Cihaz-içi kişiselleştirme — saf, gizlilik dostu (veri CİHAZDA kalır, sunucuya
 * gitmez; CLAUDE.md gizlilik duruşu). Kullanıcının pişirme geçmişinden bir
 * "afinite" (kategori + malzeme eğilimi) çıkarır ve katalogdan henüz
 * pişirilmemiş, zevkine uygun tarifleri öne çıkarır ("Sana özel").
 *
 * ML-lite: ağırlıklı içerik-tabanlı eşleme. Backend/veri toplama gerektirmez.
 */
import type { Ingredient, Recipe } from '../engine/types';
import type { HistoryEntry } from './history';

export interface Affinity {
  /** kategori → ağırlık. */
  categories: Record<string, number>;
  /** malzeme anahtarı → ağırlık. */
  ingredients: Record<string, number>;
}

/** Malzeme için dilden bağımsız kararlı anahtar (afinite eşlemesi için). */
function ingredientKey(ing: Ingredient): string {
  const name = ing.name;
  const raw = typeof name === 'string' ? name : (name.tr ?? Object.values(name)[0] ?? '');
  return raw.trim().toLowerCase();
}

function addWeight(map: Record<string, number>, key: string, w: number): void {
  if (!key) return;
  map[key] = (map[key] ?? 0) + w;
}

/** Geçmiş + katalogdan kategori/malzeme eğilimini çıkarır. */
export function buildAffinity(history: HistoryEntry[], catalog: Recipe[]): Affinity {
  const byId = new Map(catalog.map((r) => [r.id, r]));
  const categories: Record<string, number> = {};
  const ingredients: Record<string, number> = {};
  for (const entry of history) {
    const recipe = byId.get(entry.recipeId);
    if (!recipe) continue;
    const w = entry.count; // ne kadar çok pişirildiyse o kadar güçlü sinyal
    if (recipe.category) addWeight(categories, recipe.category, w);
    for (const ing of recipe.ingredients ?? []) addWeight(ingredients, ingredientKey(ing), w);
  }
  return { categories, ingredients };
}

/** Bir tarifin kullanıcı afinitesine uyum skoru (>= 0). */
export function personalizedScore(recipe: Recipe, affinity: Affinity): number {
  let score = 0;
  if (recipe.category) score += (affinity.categories[recipe.category] ?? 0) * 2;
  for (const ing of recipe.ingredients ?? []) {
    score += affinity.ingredients[ingredientKey(ing)] ?? 0;
  }
  return score;
}

/**
 * "Sana özel": zevke en uygun, HENÜZ PİŞİRİLMEMİŞ tarifler (yeni keşif).
 * Geçmiş yoksa boş döner (yeni kullanıcıda bölüm gizlenir).
 */
export function forYou(
  catalog: Recipe[],
  history: HistoryEntry[],
  opts: { limit?: number } = {},
): Recipe[] {
  if (history.length === 0) return [];
  const affinity = buildAffinity(history, catalog);
  const cookedIds = new Set(history.map((h) => h.recipeId));
  const scored = catalog
    .filter((r) => !cookedIds.has(r.id))
    .map((r) => ({ r, s: personalizedScore(r, affinity) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, opts.limit ?? 6).map((x) => x.r);
}
