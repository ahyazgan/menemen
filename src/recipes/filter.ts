/**
 * Tarif filtreleme — saf, test edilebilir. Arama metni hem TR hem EN değerlerinde
 * eşleşir; kategori verilirse ona göre süzer.
 */
import type { Recipe, RecipeCategory } from '../engine/types';

/** Seçim ekranındaki kategori sekmeleri (sıralı). */
export const CATEGORIES: RecipeCategory[] = ['kahvalti', 'corba', 'ana-yemek', 'salata', 'pilav'];

function searchableText(recipe: Recipe): string {
  const parts: string[] = [];
  const collect = (value: Recipe['title'] | undefined): void => {
    if (value == null) return;
    if (typeof value === 'string') parts.push(value);
    else parts.push(...Object.values(value));
  };
  collect(recipe.title);
  collect(recipe.summary);
  for (const ingredient of recipe.ingredients ?? []) collect(ingredient.name);
  return parts.join(' ').toLowerCase();
}

export interface RecipeFilter {
  query?: string;
  category?: RecipeCategory | null;
}

export function filterRecipes(recipes: Recipe[], filter: RecipeFilter = {}): Recipe[] {
  const query = (filter.query ?? '').trim().toLowerCase();
  const category = filter.category ?? null;
  return recipes.filter((recipe) => {
    if (category && recipe.category !== category) return false;
    if (query && !searchableText(recipe).includes(query)) return false;
    return true;
  });
}
