/**
 * Analitik servisi — funnel/retention ölçümünün zemini. Interface arkasında:
 * store'lar yalnızca track() çağırır, sağlayıcıyı görmez. Olaylar tiplenmiştir
 * ki yanlış ad/alan derleme zamanında yakalansın.
 *
 * GİZLİLİK: Buraya kişisel/serbest metin GÖNDERME (ör. öneri ifadesi, not).
 * Yalnızca olay adı ve küçük, kişisel olmayan alanlar (recipeId, gün sayısı vb.).
 */
export type AnalyticsEvent =
  // --- yaşam döngüsü / aktivasyon hunisi ---
  | { name: 'app_opened' }
  | { name: 'onboarding_started' }
  | { name: 'onboarding_completed' }
  /** Aktivasyon kuzey yıldızı: kullanıcının İLK tamamladığı yemek. */
  | { name: 'first_cook_completed'; recipeId: string }
  // --- çekirdek kullanım ---
  | { name: 'recipe_started'; recipeId: string }
  | { name: 'recipe_completed'; recipeId: string }
  | { name: 'suggestion_requested'; hasCraving: boolean }
  | { name: 'plan_generated'; days: number }
  | { name: 'shared' }
  | { name: 'screen_view'; screen: string }
  // --- büyüme / monetizasyon ---
  | { name: 'paywall_view'; variant: string }
  | { name: 'subscribed' }
  | { name: 'review_prompted' }
  | { name: 'nudge_scheduled'; kind: string }
  | { name: 'referral_opened' }
  | { name: 'referral_shared' }
  | { name: 'live_voice_started' }
  | { name: 'live_voice_ended' };

/** Olay adlarının birliği (loglama/test için kullanışlı). */
export type AnalyticsEventName = AnalyticsEvent['name'];

export interface AnalyticsService {
  /** Bir olayı kaydet. Uygulama akışını ASLA bloklamamalı (fire-and-forget). */
  track(event: AnalyticsEvent): void;
}
