/**
 * Özellik bayrakları (feature flags). Varsayılanlar burada; üretimde proxy'den
 * gelen remote config ile override edilebilir (sanitizeFlags güvenle birleştirir).
 * Saf modül — React/native import YOK; remote (güvenilmez) girdiyi doğrular.
 */
export type PaywallVariant = 'control' | 'trial7' | 'hard';

export interface FeatureFlags {
  /** Yemek tamamlanınca mağaza puanı iste. */
  reviewPrompt: boolean;
  /** Yaşam döngüsü (re-engagement) bildirimleri. */
  lifecycleNudges: boolean;
  /** Streak/gamification kartı göster. */
  streaks: boolean;
  /** Referans/davet döngüsü. */
  referral: boolean;
  /** Paywall varyantı (A/B deneyi). */
  paywallVariant: PaywallVariant;
}

export const DEFAULT_FLAGS: FeatureFlags = {
  reviewPrompt: true,
  lifecycleNudges: true,
  streaks: true,
  referral: true,
  paywallVariant: 'control',
};

const PAYWALL_VARIANTS: readonly PaywallVariant[] = ['control', 'trial7', 'hard'];

/**
 * Remote config'i (güvenilmez `unknown`) varsayılanların üstüne güvenle birleştir.
 * Tanınmayan/yanlış tipli alanlar yok sayılır; eksik alanlar varsayılanda kalır.
 */
export function sanitizeFlags(raw: unknown): FeatureFlags {
  const out: FeatureFlags = { ...DEFAULT_FLAGS };
  if (!raw || typeof raw !== 'object') return out;
  const r = raw as Record<string, unknown>;
  if (typeof r.reviewPrompt === 'boolean') out.reviewPrompt = r.reviewPrompt;
  if (typeof r.lifecycleNudges === 'boolean') out.lifecycleNudges = r.lifecycleNudges;
  if (typeof r.streaks === 'boolean') out.streaks = r.streaks;
  if (typeof r.referral === 'boolean') out.referral = r.referral;
  if (PAYWALL_VARIANTS.includes(r.paywallVariant as PaywallVariant)) {
    out.paywallVariant = r.paywallVariant as PaywallVariant;
  }
  return out;
}
