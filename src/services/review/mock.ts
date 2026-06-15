/** Mock puan servisi (Expo Go/test): gerçek akışı açmaz, yalnızca loglar. */
import type { ReviewService } from './types';

export function createMockReview(log: (msg: string) => void = () => {}): ReviewService {
  return {
    async isAvailable() {
      return false;
    },
    async request() {
      log('[review] istek (mock)');
    },
  };
}
