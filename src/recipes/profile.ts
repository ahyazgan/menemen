/**
 * Kişisel profil mantığı (saf, test edilebilir — React/Expo importu YOK).
 * "AI'nın seni tanıması": diyet tercihi, kaçındığın/sevmediğin malzemeler ve
 * beceri seviyesi. Tarif listesi buna göre süzülür; çakışmalar işaretlenir.
 *
 * Malzeme eşleşmesi pantry ile aynı kuralı kullanır: TR adı küçük harf anahtar.
 */
import type { Recipe } from '../engine/types';
import { recipeIngredientKeys } from './pantry';

export type DietPref = 'all' | 'vegetarian' | 'vegan';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Profile {
  /** Diyet tercihi (hepsi / vejetaryen / vegan). */
  diet: DietPref;
  /** Kaçınılan malzeme anahtarları (alerji ya da sevmeme). */
  avoid: string[];
  /** Beceri seviyesi (rehberlik tonunu kişiselleştirmek için). */
  skill: SkillLevel;
}

export const DEFAULT_PROFILE: Profile = { diet: 'all', avoid: [], skill: 'intermediate' };

const DIETS: readonly DietPref[] = ['all', 'vegetarian', 'vegan'];
const SKILLS: readonly SkillLevel[] = ['beginner', 'intermediate', 'advanced'];

/** Et/tavuk/balık içeren malzemeler → vejetaryen DEĞİL. */
const MEAT_KEYS = new Set(['balık', 'kıyma', 'tavuk baget', 'tavuk göğsü']);
/** Hayvansal ürünler → vegan DEĞİL (et anahtarlarına ek olarak). */
const ANIMAL_PRODUCT_KEYS = new Set([
  'yumurta',
  'tereyağı',
  'beyaz peynir',
  'rendelenmiş kaşar',
]);

export interface RecipeDiet {
  vegetarian: boolean;
  vegan: boolean;
}

/** Tarifin diyet uygunluğunu malzemelerinden türetir. */
export function recipeDiet(recipe: Recipe): RecipeDiet {
  const keys = recipeIngredientKeys(recipe);
  const hasMeat = keys.some((k) => MEAT_KEYS.has(k));
  const hasAnimalProduct = keys.some((k) => ANIMAL_PRODUCT_KEYS.has(k));
  return { vegetarian: !hasMeat, vegan: !hasMeat && !hasAnimalProduct };
}

/** Tarif seçilen diyete uyuyor mu? */
export function recipeMatchesDiet(recipe: Recipe, diet: DietPref): boolean {
  if (diet === 'all') return true;
  const d = recipeDiet(recipe);
  return diet === 'vegan' ? d.vegan : d.vegetarian;
}

/** Tarifte bulunan, kaçınılan malzeme anahtarları (boşsa çakışma yok). */
export function recipeAvoidConflicts(recipe: Recipe, avoid: Set<string>): string[] {
  if (avoid.size === 0) return [];
  return recipeIngredientKeys(recipe).filter((k) => avoid.has(k));
}

export interface ProfileMatch {
  ok: boolean;
  dietOk: boolean;
  conflicts: string[];
}

/** Tarifin profile uygunluğu: diyet + kaçınılan malzeme kontrolü. */
export function recipeMatchesProfile(recipe: Recipe, profile: Profile): ProfileMatch {
  const dietOk = recipeMatchesDiet(recipe, profile.diet);
  const conflicts = recipeAvoidConflicts(recipe, new Set(profile.avoid));
  return { ok: dietOk && conflicts.length === 0, dietOk, conflicts };
}

/** Profile uyan tarifleri döndürür (diyet dışı + kaçınılan malzemeli olanlar düşer). */
export function filterByProfile(recipes: Recipe[], profile: Profile): Recipe[] {
  return recipes.filter((r) => recipeMatchesProfile(r, profile).ok);
}

export type Difficulty = 'easy' | 'medium' | 'hard';

/** Adım sayısından kaba bir zorluk tahmini (rozet için). */
export function recipeDifficulty(recipe: Recipe): Difficulty {
  const steps = recipe.nodes.length;
  if (steps <= 4) return 'easy';
  if (steps <= 7) return 'medium';
  return 'hard';
}

/** Depodan okunan ham JSON'u güvenle Profile'a çevirir (eksik/bozuk → varsayılan). */
export function parseProfile(raw: string | null): Profile {
  if (!raw) return DEFAULT_PROFILE;
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object') return DEFAULT_PROFILE;
    const obj = data as Record<string, unknown>;
    const diet = DIETS.includes(obj.diet as DietPref) ? (obj.diet as DietPref) : 'all';
    const skill = SKILLS.includes(obj.skill as SkillLevel)
      ? (obj.skill as SkillLevel)
      : 'intermediate';
    const avoid = Array.isArray(obj.avoid)
      ? obj.avoid.filter((x): x is string => typeof x === 'string' && x.length > 0)
      : [];
    return { diet, avoid, skill };
  } catch {
    return DEFAULT_PROFILE;
  }
}

/** Profile'ı depoya yazmak için JSON'a çevirir. */
export function serializeProfile(profile: Profile): string {
  return JSON.stringify(profile);
}

/** Bir malzeme anahtarını kaçınılanlara ekler/çıkarır (yeni profil döner). */
export function toggleAvoid(profile: Profile, key: string): Profile {
  const has = profile.avoid.includes(key);
  return {
    ...profile,
    avoid: has ? profile.avoid.filter((k) => k !== key) : [...profile.avoid, key],
  };
}
