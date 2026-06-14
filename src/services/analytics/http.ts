/**
 * Basit HTTP analitik sağlayıcısı — olayları aracı sunucuya (proxy) iletir.
 * Fire-and-forget: hata olursa sessizce yutulur (akış bloklanmaz). Anahtarlar
 * istemcide değil; çağrı proxy'den geçer (bkz. server/proxy.mjs).
 */
import type { AnalyticsEvent, AnalyticsService } from './types';

export interface HttpAnalyticsConfig {
  /** Olayların POST edileceği uç nokta (ör. https://api.lezzet.app/analytics). */
  url: string;
  /** Proxy Bearer oturum token'ı (opsiyonel). */
  clientToken?: string;
}

export function createHttpAnalytics(config: HttpAnalyticsConfig): AnalyticsService {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (config.clientToken) headers.Authorization = `Bearer ${config.clientToken}`;
  return {
    track(event: AnalyticsEvent): void {
      // Beklemeden gönder; başarısızlık akışı etkilemesin.
      void fetch(config.url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...event, at: Date.now() }),
      }).catch(() => {});
    },
  };
}
