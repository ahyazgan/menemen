/** Tarif kütüphanesi. İleride graf JSON'ları buraya çoğaltılır. */
import type { Recipe } from '../engine/types';
import { menemen } from './menemen';
import { mercimekCorbasi } from './mercimekCorbasi';
import { sahandaYumurta } from './sahandaYumurta';

/** Seçim ekranı için sıralı liste. */
export const recipeList: Recipe[] = [menemen, mercimekCorbasi, sahandaYumurta];

export const recipes: Record<string, Recipe> = Object.fromEntries(
  recipeList.map((r) => [r.id, r]),
);

export { menemen, mercimekCorbasi, sahandaYumurta };

export function getRecipe(id: string): Recipe | undefined {
  return recipes[id];
}

/** "Şansıma seç" için rastgele bir tarif. */
export function randomRecipe(): Recipe {
  const index = Math.floor(Math.random() * recipeList.length);
  return recipeList[index] ?? menemen;
}
