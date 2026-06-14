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
