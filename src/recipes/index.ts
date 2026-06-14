/** Tarif kütüphanesi. İleride graf JSON'ları buraya çoğaltılır. */
import type { Recipe } from '../engine/types';
import { menemen } from './menemen';

export const recipes: Record<string, Recipe> = {
  [menemen.id]: menemen,
};

export { menemen };

export function getRecipe(id: string): Recipe | undefined {
  return recipes[id];
}
