/**
 * React Native yerleşik Share API'siyle paylaşım (ek bağımlılık yok). Sistem
 * paylaşım sayfasını açar; kullanıcı vazgeçerse sessizce döner.
 */
import { Share } from 'react-native';

import type { ShareService } from './types';

export function createRNShare(): ShareService {
  return {
    async share(message: string): Promise<void> {
      try {
        await Share.share({ message });
      } catch {
        // kullanıcı iptal etti / paylaşım açılamadı → sessiz
      }
    },
  };
}
