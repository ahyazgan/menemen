/**
 * "Elimde ne var?" mantığı (saf, test edilebilir). Elindeki malzemelere göre
 * yapabileceğin tarifleri eksiği en az olandan başlayarak sıralar.
 *
 * Malzemeler dil-bağımsız eşleşsin diye TR adı küçük harfe çevrilip anahtar
 * olarak kullanılır (tarifler TR kaynaklı).
 */
import type { LocalizedText, Recipe } from '../engine/types';
import { localize } from '../engine/localize';

function key(name: LocalizedText): string {
  return localize(name, 'tr').toLowerCase().trim();
}

export function recipeIngredientKeys(recipe: Recipe): string[] {
  return (recipe.ingredients ?? []).map((i) => key(i.name));
}

export interface PantryIngredient {
  key: string;
  name: LocalizedText;
}

/** Tüm tariflerdeki benzersiz malzemeler (seçim ekranı için), TR'ye göre sıralı. */
export function allIngredients(recipes: Recipe[]): PantryIngredient[] {
  const map = new Map<string, LocalizedText>();
  for (const recipe of recipes) {
    for (const ing of recipe.ingredients ?? []) {
      const k = key(ing.name);
      if (!map.has(k)) map.set(k, ing.name);
    }
  }
  return [...map.entries()]
    .map(([k, name]) => ({ key: k, name }))
    .sort((a, b) => a.key.localeCompare(b.key, 'tr'));
}

export interface PantryMatch {
  recipe: Recipe;
  have: number;
  total: number;
}

/**
 * En az bir malzemesi olan tarifleri döndürür; eksiği en az olan başta
 * (eşitlikte eldeki malzeme sayısı çok olan başta).
 */
export function rankByPantry(recipes: Recipe[], owned: Set<string>): PantryMatch[] {
  return recipes
    .map((recipe) => {
      const keys = recipeIngredientKeys(recipe);
      const have = keys.filter((k) => owned.has(k)).length;
      return { recipe, have, total: keys.length };
    })
    .filter((m) => m.have > 0)
    .sort((a, b) => a.total - a.have - (b.total - b.have) || b.have - a.have);
}
