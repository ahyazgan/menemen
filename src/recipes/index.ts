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
import { bulgurPilavi } from './bulgurPilavi';
import { ezogelinCorbasi } from './ezogelinCorbasi';
import { sebzeCorbasi } from './sebzeCorbasi';
import { patatesSalatasi } from './patatesSalatasi';
import { zeytinyagliFasulye } from './zeytinyagliFasulye';
import { nohutYemegi } from './nohutYemegi';
import { omlet } from './omlet';
import { peynirliTost } from './peynirliTost';
import { cacik } from './cacik';
import { kasarliYumurta } from './kasarliYumurta';
import { tavukluPilav } from './tavukluPilav';
import { tavukCorbasi } from './tavukCorbasi';

/** Seçim ekranı için sıralı liste. */
export const recipeList: Recipe[] = [
  menemen,
  sahandaYumurta,
  omlet,
  kasarliYumurta,
  peynirliTost,
  haslanmisYumurta,
  cobanSalatasi,
  patatesSalatasi,
  cacik,
  mercimekCorbasi,
  domatesCorbasi,
  ezogelinCorbasi,
  sebzeCorbasi,
  tavukCorbasi,
  pilav,
  bulgurPilavi,
  tavukluPilav,
  sigaraBoregi,
  tavukSote,
  kofte,
  firinTavuk,
  izgaraBalik,
  kuruFasulye,
  zeytinyagliFasulye,
  nohutYemegi,
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
  bulgurPilavi,
  ezogelinCorbasi,
  sebzeCorbasi,
  patatesSalatasi,
  zeytinyagliFasulye,
  nohutYemegi,
  omlet,
  peynirliTost,
  cacik,
  kasarliYumurta,
  tavukluPilav,
  tavukCorbasi,
};

export function getRecipe(id: string): Recipe | undefined {
  return recipes[id];
}

/** "Şansıma seç" için rastgele bir tarif. */
export function randomRecipe(): Recipe {
  const index = Math.floor(Math.random() * recipeList.length);
  return recipeList[index] ?? menemen;
}
