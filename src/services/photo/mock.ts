/** Mock fotoğraf servisi — UI'ı native modülsüz test/çalıştırmak için. */
import type { PhotoService } from './types';

export function createMockPhoto(uri: string | null = 'mock://step-photo.jpg'): PhotoService {
  return {
    async requestPermission(): Promise<boolean> {
      return true;
    },
    async capture(): Promise<string | null> {
      return uri;
    },
  };
}
