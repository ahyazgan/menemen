/** Mock/no-op analitik — test ve geliştirme için (gerçek sağlayıcı gerekmez). */
import type { AnalyticsEvent, AnalyticsService } from './types';

/** Hiçbir şey yapmaz — varsayılan (gizlilik açısından güvenli). */
export function createNoopAnalytics(): AnalyticsService {
  return { track: () => {} };
}

/** Olayları bir sink'e iletir (geliştirmede console, testte diziye toplama). */
export function createMockAnalytics(
  sink: (event: AnalyticsEvent) => void = () => {},
): AnalyticsService {
  return { track: (event) => sink(event) };
}
