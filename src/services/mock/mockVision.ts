/**
 * Mock Vision — GIDA GÜVENLİĞİ kuralına uyar: gözlem + öneri verir, asla kesin
 * hüküm vermez. Gerçek: services/real/claudeVision.ts.
 */
import type { VisionResult, VisionService } from '../types';

export function createMockVision(): VisionService {
  return {
    async analyze(_imageUri: string, _prompt: string): Promise<VisionResult> {
      return {
        observation: 'Kenarlar altın rengine dönmüş, ortası biraz daha açık.',
        suggestion: 'İyi görünüyor ama emin olmak için bir iki dakika daha pişirmeni öneririm.',
        confidence: 0.6,
      };
    },
  };
}
