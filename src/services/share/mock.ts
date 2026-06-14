/** Mock paylaşım servisi — UI'ı native modülsüz test/çalıştırmak için. */
import type { ShareService } from './types';

export function createMockShare(sink: (message: string) => void = () => {}): ShareService {
  return {
    async share(message: string): Promise<void> {
      sink(message);
    },
  };
}
