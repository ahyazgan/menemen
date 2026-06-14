/**
 * Beceri seviyesinin gerçek etkisi (saf, testli). Profildeki beceri yalnızca
 * saklanmaz; öneri/plan sıralamasını ve pişirme ekranındaki rehberlik detayını
 * belirler. Yeni başlayan kolay tarifleri, ileri seviye zorları yeğler.
 */
import type { Recipe } from '../engine/types';
import { recipeDifficulty, type Difficulty, type SkillLevel } from './profile';

const ORDER: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };

/**
 * Tarifin beceriye uygunluk puanı (0 = en uygun). Yeni başlayan için kolay 0,
 * ileri için zor 0; orta seviye nötr (hepsi 0 → sıralamayı değiştirmez).
 */
export function skillFitScore(recipe: Recipe, skill: SkillLevel): number {
  if (skill === 'intermediate') return 0;
  const d = ORDER[recipeDifficulty(recipe)];
  return skill === 'beginner' ? d : 2 - d;
}

export interface Guidance {
  /** Adım sayacı göster ("Adım 2/8"). İleri seviyede kapalı. */
  stepNumbers: boolean;
  /** Ekstra cesaretlendirme/ipucu metni. Yalnızca yeni başlayanda. */
  verbose: boolean;
}

/** Beceri seviyesine göre pişirme ekranı rehberlik ayarları. */
export function guidance(skill: SkillLevel): Guidance {
  return {
    stepNumbers: skill !== 'advanced',
    verbose: skill === 'beginner',
  };
}
