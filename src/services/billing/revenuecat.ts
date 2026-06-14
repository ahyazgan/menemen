/**
 * RevenueCat tabanlı billing (iOS Apple IAP + Android Play Billing).
 * RevenueCat platforma göre ayrı public SDK anahtarı kullanır; Platform.OS ile
 * doğru anahtar seçilir.
 */
import { Platform } from 'react-native';
import Purchases, { type PurchasesPackage } from 'react-native-purchases';

import type { BillingService, SubscriptionPlan } from './types';

export interface RevenueCatConfig {
  /** RevenueCat iOS public SDK anahtarı. */
  iosApiKey: string;
  /** RevenueCat Android public SDK anahtarı. */
  androidApiKey: string;
  /** Premium yetki kimliği (RevenueCat dashboard). Varsayılan "premium". */
  entitlementId?: string;
}

export function createRevenueCatBilling(config: RevenueCatConfig): BillingService {
  const entitlement = config.entitlementId ?? 'premium';
  const apiKey = Platform.OS === 'ios' ? config.iosApiKey : config.androidApiKey;
  const packageCache = new Map<string, PurchasesPackage>();
  let configured = false;

  return {
    async configure(): Promise<void> {
      if (configured) return;
      Purchases.configure({ apiKey });
      configured = true;
    },

    async getPlans(): Promise<SubscriptionPlan[]> {
      const offerings = await Purchases.getOfferings();
      const packages = offerings.current?.availablePackages ?? [];
      packageCache.clear();
      return packages.map((pkg) => {
        packageCache.set(pkg.identifier, pkg);
        return {
          id: pkg.identifier,
          title: pkg.product.title,
          description: pkg.product.description,
          priceLabel: pkg.product.priceString,
        };
      });
    },

    async purchase(planId: string): Promise<boolean> {
      const pkg = packageCache.get(planId);
      if (!pkg) throw new Error(`Bilinmeyen plan: ${planId}. Önce getPlans() çağır.`);
      const result = await Purchases.purchasePackage(pkg);
      return Boolean(result.customerInfo.entitlements.active[entitlement]);
    },

    async restore(): Promise<boolean> {
      const info = await Purchases.restorePurchases();
      return Boolean(info.entitlements.active[entitlement]);
    },

    async isSubscribed(): Promise<boolean> {
      const info = await Purchases.getCustomerInfo();
      return Boolean(info.entitlements.active[entitlement]);
    },
  };
}
