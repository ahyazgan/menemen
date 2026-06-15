/**
 * subscriptionStore — abonelik durumu (CLAUDE.md iş modeli). Billing servisini
 * (mock veya RevenueCat) sarar; UI yalnızca buradaki action'ları çağırır.
 */
import { create } from 'zustand';

import type { BillingService, SubscriptionPlan } from '../services/billing';
import { createMockBilling } from '../services/billing';
import { track } from '../services/analytics';
import { getFlags } from './flagsStore';

interface SubscriptionState {
  billing: BillingService;
  subscribed: boolean;
  plans: SubscriptionPlan[];
  loading: boolean;
  error: string | null;

  /** Billing'i değiştir (mock → RevenueCat). */
  setBilling: (billing: BillingService) => void;
  /** SDK'yı yapılandır, durumu ve planları yükle. */
  init: () => Promise<void>;
  /** Mevcut abonelik durumunu tazele. */
  refresh: () => Promise<void>;
  /** Bir planı satın al. */
  purchase: (planId: string) => Promise<void>;
  /** Önceki satın alımları geri yükle. */
  restore: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  billing: createMockBilling(),
  subscribed: false,
  plans: [],
  loading: false,
  error: null,

  setBilling: (billing) => set({ billing }),

  init: async () => {
    set({ loading: true, error: null });
    try {
      const { billing } = get();
      await billing.configure();
      const [subscribed, plans] = await Promise.all([billing.isSubscribed(), billing.getPlans()]);
      set({ subscribed, plans });
    } catch (err) {
      set({ error: toMessage(err) });
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      set({ subscribed: await get().billing.isSubscribed() });
    } catch (err) {
      set({ error: toMessage(err) });
    }
  },

  purchase: async (planId) => {
    set({ loading: true, error: null });
    try {
      const subscribed = await get().billing.purchase(planId);
      set({ subscribed });
      // Varyantla izle → paywall_view ile birlikte dönüşüm oranı kıyaslanır.
      if (subscribed) track({ name: 'subscribed', variant: getFlags().paywallVariant });
    } catch (err) {
      set({ error: toMessage(err) });
    } finally {
      set({ loading: false });
    }
  },

  restore: async () => {
    set({ loading: true, error: null });
    try {
      const subscribed = await get().billing.restore();
      set({ subscribed });
    } catch (err) {
      set({ error: toMessage(err) });
    } finally {
      set({ loading: false });
    }
  },
}));

function toMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Bilinmeyen hata';
}
