/**
 * Haftalık menü planı — saf mantık (React/Expo importu YOK, testli).
 * Profile uyan tariflerden çeşitliliği gözeten bir plan üretir, gün değiştirir
 * ve plandaki tüm tariflerin malzemelerini tek bir alışveriş listesinde toplar.
 *
 * Rastgelelik dışarıdan verilebilir (rng) → testlerde deterministik.
 */
import type { Recipe } from '../engine/types';
import { localize } from '../engine/localize';
import { filterByProfile, type Profile } from './profile';
import { skillFitScore } from './skill';
import { formatQuantity } from './ingredients';
import type { ShoppingItem } from './shopping';

/** Plan = gün sırasına göre tarif id'leri (uzunluk = gün sayısı). */
export type MealPlan = string[];

type Rng = () => number;

/** Tohumlanabilir basit PRNG (mulberry32) — deterministik testler için. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * Beceriye göre kademeli karıştırma: tarifleri uygunluk puanına göre gruplar
 * (yeni başlayan → kolaylar önce), her grubu kendi içinde karıştırıp birleştirir.
 * Orta seviyede tek grup oluşur → düz karıştırmaya eşittir.
 */
function shuffleBySkill(recipes: Recipe[], profile: Profile, rng: Rng): Recipe[] {
  const tiers = new Map<number, Recipe[]>();
  for (const r of recipes) {
    const s = skillFitScore(r, profile.skill);
    const bucket = tiers.get(s) ?? [];
    bucket.push(r);
    tiers.set(s, bucket);
  }
  const out: Recipe[] = [];
  for (const score of [...tiers.keys()].sort((a, b) => a - b)) {
    out.push(...shuffle(tiers.get(score)!, rng));
  }
  return out;
}

/**
 * `days` günlük plan üretir: önce profile uyan tarifleri karıştırıp benzersiz
 * seçer; yeterli benzersiz tarif yoksa baştan döngüyle tamamlar (tekrar olabilir).
 */
export function generatePlan(
  recipes: Recipe[],
  profile: Profile,
  days: number,
  rng: Rng = Math.random,
): MealPlan {
  const eligible = filterByProfile(recipes, profile);
  if (eligible.length === 0 || days <= 0) return [];
  const shuffled = shuffleBySkill(eligible, profile, rng);
  const plan: MealPlan = [];
  for (let i = 0; i < days; i++) {
    plan.push(shuffled[i % shuffled.length]!.id);
  }
  return plan;
}

/**
 * Bir günün tarifini değiştirir: planda olmayan (mümkünse) ve mevcuttan farklı
 * uygun bir tarif seçer. Uygun alternatif yoksa plan değişmez.
 */
export function swapDay(
  plan: MealPlan,
  recipes: Recipe[],
  profile: Profile,
  day: number,
  rng: Rng = Math.random,
): MealPlan {
  if (day < 0 || day >= plan.length) return plan;
  const eligible = filterByProfile(recipes, profile);
  const inPlan = new Set(plan);
  const current = plan[day];
  const fresh = eligible.filter((r) => !inPlan.has(r.id));
  const pool = fresh.length > 0 ? fresh : eligible.filter((r) => r.id !== current);
  if (pool.length === 0) return plan;
  const pick = shuffle(pool, rng)[0]!;
  const next = [...plan];
  next[day] = pick.id;
  return next;
}

/**
 * Plandaki tüm tariflerin malzemelerini tek listede toplar. Aynı malzeme+birim
 * miktarları toplanır; miktarsız malzemeler (tuz, karabiber) bir kez listelenir.
 */
export function planIngredients(plan: MealPlan, recipes: Recipe[], locale: string): ShoppingItem[] {
  const byId = new Map(recipes.map((r) => [r.id, r]));
  interface Agg {
    name: string;
    unit: string;
    quantity: number | null;
  }
  const agg = new Map<string, Agg>();

  for (const id of plan) {
    const recipe = byId.get(id);
    if (!recipe) continue;
    for (const ing of recipe.ingredients ?? []) {
      const name = localize(ing.name, locale);
      const unit = ing.unit ? localize(ing.unit, locale) : '';
      const nameKey = localize(ing.name, 'tr').toLowerCase().trim();
      const unitKey = ing.unit ? localize(ing.unit, 'tr').toLowerCase().trim() : '';
      const key = `${nameKey}|${unitKey}`;
      const existing = agg.get(key);
      if (existing) {
        if (existing.quantity != null && ing.quantity != null) {
          existing.quantity += ing.quantity;
        }
      } else {
        agg.set(key, { name, unit, quantity: ing.quantity ?? null });
      }
    }
  }

  return [...agg.entries()].map(([key, { name, unit, quantity }]) => ({
    id: `plan:${key}`,
    label:
      quantity != null
        ? `${formatQuantity(quantity)}${unit ? ` ${unit}` : ''} ${name}`.trim()
        : name,
    checked: false,
  }));
}

/** Depodan okunan ham JSON'u güvenle plana çevirir (bozuksa boş). */
export function parsePlan(raw: string | null): MealPlan {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter((x): x is string => typeof x === 'string');
  } catch {
    return [];
  }
}

export function serializePlan(plan: MealPlan): string {
  return JSON.stringify(plan);
}
