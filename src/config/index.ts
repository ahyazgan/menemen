/**
 * Sabitler ve özellik bayrakları. İzin metinleri app.json'da tutulur; burada
 * yalnızca çalışma zamanı yapılandırması var.
 */

/** v1'de mock servisler kullanılır; gerçek servisler hazır olunca false yap. */
export const USE_MOCK_SERVICES = true;

/** Düşük güven eşiği: bunun altında store kullanıcıdan teyit ister. */
export const INTENT_CONFIDENCE_THRESHOLD = 0.5;

/** Varsayılan başlangıç tarifi. */
export const DEFAULT_RECIPE_ID = 'menemen';

/** true ise uygulama paywall ile kapılanır (üretim). Dev'de false. */
export const REQUIRE_SUBSCRIPTION = false;

/** RevenueCat premium yetki kimliği. */
export const ENTITLEMENT_ID = 'premium';

/** Uygulama sürümü (Ayarlar ekranında gösterilir; app.json ile eşle). */
export const APP_VERSION = '0.1.0';
