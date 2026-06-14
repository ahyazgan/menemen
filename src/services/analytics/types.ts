/**
 * Analitik servisi — funnel/retention ölçümünün zemini. Interface arkasında:
 * store'lar yalnızca track() çağırır, sağlayıcıyı görmez. Olaylar tiplenmiştir
 * ki yanlış ad/alan derleme zamanında yakalansın.
 *
 * GİZLİLİK: Buraya kişisel/serbest metin GÖNDERME (ör. öneri ifadesi, not).
 * Yalnızca olay adı ve küçük, kişisel olmayan alanlar (recipeId, gün sayısı vb.).
 */
export type AnalyticsEvent =
  | { name: 'onboarding_completed' }
  | { name: 'recipe_started'; recipeId: string }
  | { name: 'recipe_completed'; recipeId: string }
  | { name: 'suggestion_requested'; hasCraving: boolean }
  | { name: 'plan_generated'; days: number }
  | { name: 'shared' }
  | { name: 'subscribed' }
  | { name: 'screen_view'; screen: string };

/** Olay adlarının birliği (loglama/test için kullanışlı). */
export type AnalyticsEventName = AnalyticsEvent['name'];

export interface AnalyticsService {
  /** Bir olayı kaydet. Uygulama akışını ASLA bloklamamalı (fire-and-forget). */
  track(event: AnalyticsEvent): void;
}
