/**
 * Mock billing — paywall ve abonelik akışını mağaza/SDK olmadan test etmek için.
 * Satın alma anında abonelik durumunu bellekte true yapar.
 */
import type { BillingService, SubscriptionPlan } from './types';

const MOCK_PLANS: SubscriptionPlan[] = [
  { id: 'monthly', title: 'Lezzet Pro — Aylık', description: 'Sınırsız canlı pişirme', priceLabel: '₺49,99/ay' },
  { id: 'annual', title: 'Lezzet Pro — Yıllık', description: '2 ay hediye', priceLabel: '₺399,99/yıl' },
];

export function createMockBilling(initiallySubscribed = false): BillingService {
  let subscribed = initiallySubscribed;
  return {
    async configure(): Promise<void> {
      /* mock: no-op */
    },
    async getPlans(): Promise<SubscriptionPlan[]> {
      return MOCK_PLANS;
    },
    async purchase(_planId: string): Promise<boolean> {
      subscribed = true;
      return subscribed;
    },
    async restore(): Promise<boolean> {
      return subscribed;
    },
    async isSubscribed(): Promise<boolean> {
      return subscribed;
    },
  };
}
