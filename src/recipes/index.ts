/** Tarif kütüphanesi. Graf JSON'ları buraya çoğaltılır. */
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
import { sucukluYumurta } from './sucukluYumurta';
import { gozleme } from './gozleme';
import { pankek } from './pankek';
import { yumurtaliEkmek } from './yumurtaliEkmek';
import { yaylaCorbasi } from './yaylaCorbasi';
import { brokoliCorbasi } from './brokoliCorbasi';
import { mantarCorbasi } from './mantarCorbasi';
import { ispanakCorbasi } from './ispanakCorbasi';
import { balikCorbasi } from './balikCorbasi';
import { firindaSebze } from './firindaSebze';
import { karniyarik } from './karniyarik';
import { imamBayildi } from './imamBayildi';
import { mercimekKoftesi } from './mercimekKoftesi';
import { biberDolmasi } from './biberDolmasi';
import { lahanaSarma } from './lahanaSarma';
import { tavukSis } from './tavukSis';
import { kuzuPirzola } from './kuzuPirzola';
import { patlicanMusakka } from './patlicanMusakka';
import { icPilav } from './icPilav';
import { nohutluPilav } from './nohutluPilav';
import { sehriyeliPilav } from './sehriyeliPilav';
import { mevsimSalatasi } from './mevsimSalatasi';
import { rokaSalatasi } from './rokaSalatasi';
import { piyaz } from './piyaz';
import { kisir } from './kisir';

/** Seçim ekranı için sıralı liste. */
export const recipeList: Recipe[] = [
  // Kahvaltı
  menemen,
  sahandaYumurta,
  omlet,
  kasarliYumurta,
  sucukluYumurta,
  yumurtaliEkmek,
  peynirliTost,
  gozleme,
  pankek,
  haslanmisYumurta,
  // Çorba
  mercimekCorbasi,
  domatesCorbasi,
  ezogelinCorbasi,
  sebzeCorbasi,
  yaylaCorbasi,
  brokoliCorbasi,
  mantarCorbasi,
  ispanakCorbasi,
  tavukCorbasi,
  balikCorbasi,
  // Salata
  cobanSalatasi,
  patatesSalatasi,
  cacik,
  mevsimSalatasi,
  rokaSalatasi,
  piyaz,
  kisir,
  // Pilav
  pilav,
  bulgurPilavi,
  tavukluPilav,
  icPilav,
  nohutluPilav,
  sehriyeliPilav,
  // Ana yemek
  sigaraBoregi,
  tavukSote,
  kofte,
  firinTavuk,
  izgaraBalik,
  kuruFasulye,
  zeytinyagliFasulye,
  nohutYemegi,
  firindaSebze,
  karniyarik,
  imamBayildi,
  mercimekKoftesi,
  biberDolmasi,
  lahanaSarma,
  tavukSis,
  kuzuPirzola,
  patlicanMusakka,
];

export const recipes: Record<string, Recipe> = Object.fromEntries(recipeList.map((r) => [r.id, r]));

// --- Dinamik registry (uzak/CMS içeriği) -------------------------------------
// Paket içi tarifler GARANTİLİ tabandır (offline + güvenli). Uzak tarifler
// yalnızca YENİ id'lerle EKLENİR; çakışmada paket kazanır (uzak, güvenlik
// kritik bir paket tarifini EZEMEZ). Doğrulama recipes/validate.ts'te.
let effectiveList: Recipe[] = recipeList;
let effectiveMap: Record<string, Recipe> = recipes;

/** Uzak (doğrulanmış) tarifleri tabana ekle. Paket id'leri korunur. */
export function setRemoteRecipes(extra: Recipe[]): void {
  const ids = new Set(recipeList.map((r) => r.id));
  const merged = [...recipeList];
  for (const r of extra) {
    if (!ids.has(r.id)) {
      merged.push(r);
      ids.add(r.id);
    }
  }
  effectiveList = merged;
  effectiveMap = Object.fromEntries(merged.map((r) => [r.id, r]));
}

/** Paket + uzak tariflerin birleşik (etkin) listesi. */
export function allRecipes(): Recipe[] {
  return effectiveList;
}

export function getRecipe(id: string): Recipe | undefined {
  return effectiveMap[id];
}

/** "Şansıma seç" için rastgele bir tarif (paket + uzak). */
export function randomRecipe(): Recipe {
  const index = Math.floor(Math.random() * effectiveList.length);
  return effectiveList[index] ?? menemen;
}
