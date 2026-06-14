/**
 * shareStore — paylaşım servisini tutar; ekran yalnızca share() çağırır. Mantık
 * yok (mesaj saf recipes/share.ts'te üretilir); burada yalnızca servis bağlama.
 */
import { create } from 'zustand';

import { createMockShare, type ShareService } from '../services/share';
import { track } from '../services/analytics';

interface ShareState {
  service: ShareService;
  setService: (service: ShareService) => void;
  share: (message: string) => Promise<void>;
}

export const useShareStore = create<ShareState>((set, get) => ({
  service: createMockShare(),
  setService: (service) => set({ service }),
  share: (message) => {
    track({ name: 'shared' });
    return get().service.share(message);
  },
}));
