/**
 * Çökme/hata raporlama servisi. Interface arkasında — uygulama yalnızca
 * reportError() çağırır, sağlayıcıyı (Sentry vb.) görmez (test/mock'lanabilir).
 *
 * GİZLİLİK: Buraya kişisel/serbest metin gönderme; yalnızca hata + küçük teknik
 * bağlam (ekran adı, bileşen yığını).
 */
export interface CrashReporter {
  captureException(error: unknown, context?: Record<string, unknown>): void;
}
