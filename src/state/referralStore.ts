/**
 * referralStore — viral döngü atıfı. Cihaza özel, takma adlı bir davet kodu
 * üretip kalıcılaştırır (paylaşımlarda kullanılır) ve gelen bir davet kodunu
 * BİR KEZ yakalar (kim davet etti). Ödül dağıtımı backend tarafıdır; burada
 * yalnızca atıf + analitik. Saf üretim/ayrıştırma recipes/share.ts'te ve testli.
 */
import { create } from 'zustand';

import { genReferralCode, parseReferral } from '../recipes/share';
import { createMemoryStore, type KeyValueStore } from '../services/storage';
import { track } from '../services/analytics';

const CODE_KEY = 'lezzet.referralCode';
const REFERRED_KEY = 'lezzet.referredBy';

interface ReferralState {
  store: KeyValueStore;
  /** Bu cihazın paylaşımlarda kullanacağı davet kodu. */
  myCode: string | null;
  /** Bu kullanıcıyı davet eden kod (varsa, bir kez yakalanır). */
  referredBy: string | null;
  setStore: (store: KeyValueStore) => void;
  /** Kayıtlı kodları yükle; kendi kodun yoksa üret ve kalıcılaştır. */
  load: () => Promise<void>;
  /** Gelen derin bağlantıdan davet kodunu (ilk kez) yakala. */
  captureIncoming: (url: string | null) => Promise<void>;
}

export const useReferralStore = create<ReferralState>((set, get) => ({
  store: createMemoryStore(),
  myCode: null,
  referredBy: null,

  setStore: (store) => set({ store }),

  load: async () => {
    const [code, referred] = await Promise.all([
      get().store.getItem(CODE_KEY),
      get().store.getItem(REFERRED_KEY),
    ]);
    let myCode = code;
    if (!myCode) {
      myCode = genReferralCode();
      await get().store.setItem(CODE_KEY, myCode);
    }
    set({ myCode, referredBy: referred });
  },

  captureIncoming: async (url) => {
    if (get().referredBy) return; // atıf yalnızca bir kez
    const code = parseReferral(url);
    if (!code || code === get().myCode) return; // kendi linkini sayma
    set({ referredBy: code });
    track({ name: 'referral_opened' });
    await get().store.setItem(REFERRED_KEY, code);
  },
}));
