/**
 * Abonelik (billing) arayüzü — harici sağlayıcı (RevenueCat) bir interface
 * arkasında (CLAUDE.md: services interface arkasında, test için mock'lanabilir).
 *
 * CLAUDE.md iş modeli: iOS'ta Apple IAP zorunlu, Android'de Play Billing.
 * Uygulama içinde IAP dışı dijital ödeme SATILMAZ — bu yüzden iyzico/Stripe yok.
 */

export interface SubscriptionPlan {
  /** Satın alma için kullanılan paket kimliği. */
  id: string;
  title: string;
  description: string;
  /** Mağaza biçimli fiyat etiketi, örn. "₺49,99/ay". */
  priceLabel: string;
}

export interface BillingService {
  /** SDK'yı yapılandır (idempotent olmalı). */
  configure(): Promise<void>;
  /** Satılabilir abonelik planları. */
  getPlans(): Promise<SubscriptionPlan[]>;
  /** Bir planı satın al; sonuçta premium aktif mi döndürür. */
  purchase(planId: string): Promise<boolean>;
  /** Önceki satın alımları geri yükle; premium aktif mi döndürür. */
  restore(): Promise<boolean>;
  /** Premium yetkisi şu an aktif mi? */
  isSubscribed(): Promise<boolean>;
}
