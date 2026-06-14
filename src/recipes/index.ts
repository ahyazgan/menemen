/** Tarif kütüphanesi. İleride graf JSON'ları buraya çoğaltılır. */
import type { Recipe } from '../engine/types';
import { menemen } from './menemen';
import { mercimekCorbasi } from './mercimekCorbasi';
import { sahandaYumurta } from './sahandaYumurta';
import { tavukSote } from './tavukSote';
import { kofte } from './kofte';
import { pilav } from './pilav';
import { kuruFasulye } from './kuruFasulye';
import { domatesCorbasi } from './domatesCorbasi';
import { sigaraBoregi } from './sigaraBoregi';
import { cobanSalatasi } from './cobanSalatasi';
import { haslanmisYumurta } from './haslanmisYumurta';
import { firinTavuk } from './firinTavuk';
import { izgaraBalik } from './izgaraBalik';

/** Seçim ekranı için sıralı liste. */
export const recipeList: Recipe[] = [
  menemen,
  sahandaYumurta,
  cobanSalatasi,
  haslanmisYumurta,
  mercimekCorbasi,
  domatesCorbasi,
  pilav,
  sigaraBoregi,
  tavukSote,
  kofte,
  firinTavuk,
  izgaraBalik,
  kuruFasulye,
];

export const recipes: Record<string, Recipe> = Object.fromEntries(
  recipeList.map((r) => [r.id, r]),
);

export {
  menemen,
  mercimekCorbasi,
  sahandaYumurta,
  tavukSote,
  kofte,
  pilav,
  kuruFasulye,
  domatesCorbasi,
  sigaraBoregi,
  cobanSalatasi,
  haslanmisYumurta,
  firinTavuk,
  izgaraBalik,
};

export function getRecipe(id: string): Recipe | undefined {
  return recipes[id];
}

/** "Şansıma seç" için rastgele bir tarif. */
export function randomRecipe(): Recipe {
  const index = Math.floor(Math.random() * recipeList.length);
  return recipeList[index] ?? menemen;
}
