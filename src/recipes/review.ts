/**
 * Mağaza puanı isteme kapısı için saf mantık (ASO büyüme kaldıracı). Kullanıcıyı
 * "aha anından" sonra (birkaç başarılı yemek) ve sürüm başına en fazla bir kez
 * rahatsız et. Kalıcılık reviewStore'da; burada yalnızca karar.
 */
export interface ReviewGateInput {
  /** Bugüne dek toplam tamamlanan yemek sayısı. */
  completedCookCount: number;
  /** Daha önce puan istenen sürüm (yoksa null). */
  lastPromptedVersion: string | null;
  /** Geçerli uygulama sürümü. */
  currentVersion: string;
}

/** En az 2 başarılı yemek tamamlandıysa ve bu sürümde henüz sorulmadıysa iste. */
export function shouldRequestReview(input: ReviewGateInput): boolean {
  return input.completedCookCount >= 2 && input.lastPromptedVersion !== input.currentVersion;
}
