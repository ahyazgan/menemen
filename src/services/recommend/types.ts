/**
 * Tarif öneri servisi — kullanıcının "canım ne çekiyor" ifadesi + profiline göre
 * ONAYLI tariflerimizden birini seçer. Interface arkasında: store yalnızca bunu
 * çağırır (mock = yerel sıralayıcı, real = Claude). AI yeni tarif ÜRETMEZ; yalnızca
 * verilen adaylar arasından seçer (gıda güvenliği + mağaza güvencesi).
 */
import type { Recipe } from '../../engine/types';
import type { Profile } from '../../recipes/profile';

export interface RecommendInput {
  /** Kullanıcının serbest ifadesi (örn. "hafif bir şey, çorba gibi"). */
  craving: string;
  /** Seçim/gerekçe bu dilde üretilir. */
  locale: string;
  /** Kişisel profil (diyet + kaçınılan malzeme + beceri). */
  profile: Profile;
  /** Aralarından seçilecek onaylı tarifler. */
  candidates: Recipe[];
}

export interface RecommendResult {
  /** Önerilen tarif id'si (aday listesinde olmalı) ya da uygun yoksa null. */
  recipeId: string | null;
  /** AI'nın kısa gerekçesi (kullanıcı dilinde). Yoksa ekran genel metin gösterir. */
  reason?: string;
}

export interface RecommendService {
  suggest(input: RecommendInput): Promise<RecommendResult>;
}
