/**
 * "Sana özel tarif öner" — saf öneri mantığı (React/Expo importu YOK, testli).
 *
 * Güvenlik: yalnızca onaylı (mevcut) tariflerimiz arasından öneri yapılır; AI
 * yeni tarif/uydurma adım ÜRETMEZ. Bu saf sıralayıcı hem yerel öneri (mock) hem
 * de AI servisinin çevrimdışı yedeği olarak kullanılır.
 *
 * Eşleşme dil-bağımsız olsun diye metinler hem TR hem EN üzerinden taranır.
 */
import type { Recipe } from '../engine/types';
import { localize } from '../engine/localize';
import { filterByProfile, type Profile } from './profile';
import { skillFitScore } from './skill';

export interface ScoredRecipe {
  recipe: Recipe;
  score: number;
}

/** İfadeyi anlamlı kelimelere böler (2+ harf, küçük harf). */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length >= 2);
}

function haystack(recipe: Recipe): { title: string; summary: string; ingredients: string } {
  const both = (v: Parameters<typeof localize>[0]): string =>
    `${localize(v, 'tr')} ${localize(v, 'en')}`.toLowerCase();
  return {
    title: both(recipe.title),
    summary: recipe.summary ? both(recipe.summary) : '',
    ingredients: (recipe.ingredients ?? []).map((i) => both(i.name)).join(' '),
  };
}

/** Bir tarifin ifadeye uygunluk puanı (başlık > malzeme > özet ağırlıklı). */
export function scoreRecipe(tokens: string[], recipe: Recipe): number {
  if (tokens.length === 0) return 0;
  const hay = haystack(recipe);
  let score = 0;
  for (const token of tokens) {
    if (hay.title.includes(token)) score += 3;
    if (hay.ingredients.includes(token)) score += 2;
    if (hay.summary.includes(token)) score += 1;
  }
  return score;
}

/**
 * Profile uyan tarifleri ifadeye göre puanlayıp sıralar (yüksek puan başta).
 * Boş ifadede tüm puanlar 0 olur; sıra profil süzgecindeki orijinal sıradır.
 */
export function rankByCraving(
  craving: string,
  recipes: Recipe[],
  profile: Profile,
): ScoredRecipe[] {
  const tokens = tokenize(craving);
  const eligible = filterByProfile(recipes, profile);
  return (
    eligible
      .map((recipe, index) => ({
        recipe,
        score: scoreRecipe(tokens, recipe),
        fit: skillFitScore(recipe, profile.skill),
        index,
      }))
      // Önce uygunluk puanı, eşitlikte beceriye uygunluk (orta seviyede nötr), sonra sıra.
      .sort((a, b) => b.score - a.score || a.fit - b.fit || a.index - b.index)
      .map(({ recipe, score }) => ({ recipe, score }))
  );
}

/**
 * En uygun tarifin id'sini döndürür. Eşleşme yoksa (hepsi 0 puan) yine de
 * profile uyan ilk tarifi önerir; hiç uygun tarif yoksa null.
 */
export function bestRecipeId(craving: string, recipes: Recipe[], profile: Profile): string | null {
  const ranked = rankByCraving(craving, recipes, profile);
  return ranked[0]?.recipe.id ?? null;
}

/** AI'dan dönen id'nin gerçekten aday listemizde olduğunu doğrular (güvenlik). */
export function isValidRecipeId(id: string, recipes: Recipe[]): boolean {
  return recipes.some((r) => r.id === id);
}
