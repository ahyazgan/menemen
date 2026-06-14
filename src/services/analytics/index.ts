/**
 * Analitik kamu API'si + uygulama geneli ince yardımcı. Store'lar `track()`
 * çağırır; aktif sağlayıcı `setAnalytics()` ile bağlanır (varsayılan: no-op).
 */
import { createNoopAnalytics } from './mock';
import type { AnalyticsEvent, AnalyticsService } from './types';

export * from './types';
export { createNoopAnalytics, createMockAnalytics } from './mock';
export { createHttpAnalytics, type HttpAnalyticsConfig } from './http';

let current: AnalyticsService = createNoopAnalytics();

/** Aktif analitik sağlayıcısını ayarla (App açılışında). */
export function setAnalytics(service: AnalyticsService): void {
  current = service;
}

/** Bir olayı kaydet — hata akışı bloklamaz. */
export function track(event: AnalyticsEvent): void {
  try {
    current.track(event);
  } catch {
    // analitik asla uygulamayı bozmamalı
  }
}
