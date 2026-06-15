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

/**
 * Backend proxy adresi. DOLU olursa App açılışta gerçek servisleri (Claude
 * vision/intent + AI öneri + bulut STT) otomatik bağlar; cihaz-içi TTS korunur.
 * BOŞ ise mock/yerel + cihaz-içi kalır. Üretimde buraya proxy URL'ini yaz
 * (ör. 'https://api.lezzet.app'); kodu elle değiştirmen gerekmez.
 */
export const PROXY_BASE_URL = '';

/** Proxy'ye gönderilecek istemci oturum token'ı (Bearer). Opsiyonel. */
export const PROXY_CLIENT_TOKEN = '';

/**
 * Sentry DSN. DOLU olursa App açılışta çökme/hata raporlamayı (Sentry) bağlar;
 * BOŞ ise konsola düşer (Expo Go/dev). Üretim için `npx expo install
 * @sentry/react-native` + buraya DSN. DSN gizli anahtar değildir (yalnızca olay
 * gönderimi); gerçek sağlayıcı anahtarları yine proxy'de kalır.
 */
export const SENTRY_DSN = '';
