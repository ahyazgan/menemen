/**
 * expo-store-review tabanlı gerçek puan servisi. Modül DİNAMİK import edilir;
 * paket kurulu değilse (veya Expo Go) güvenle "kullanılamaz"a düşer — açılış
 * grafiğine native modül sokmaz. Gerçek akış için: `npx expo install
 * expo-store-review` ve dev-client/üretim build'i.
 */
import type { ReviewService } from './types';

type StoreReviewModule = {
  isAvailableAsync(): Promise<boolean>;
  requestReview(): Promise<void>;
};

async function loadModule(): Promise<StoreReviewModule | null> {
  try {
    return (await import('expo-store-review')) as unknown as StoreReviewModule;
  } catch {
    return null;
  }
}

export function createExpoReview(): ReviewService {
  return {
    async isAvailable() {
      const mod = await loadModule();
      if (!mod) return false;
      try {
        return await mod.isAvailableAsync();
      } catch {
        return false;
      }
    },
    async request() {
      const mod = await loadModule();
      if (!mod) return;
      try {
        await mod.requestReview();
      } catch {
        // puan akışı açılamadı → sessizce geç (kullanıcı akışını bozma)
      }
    },
  };
}
