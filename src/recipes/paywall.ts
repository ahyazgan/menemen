/**
 * Paywall A/B varyant mantığı — saf, test edilebilir. Hangi varyantın hangi
 * çerçeveyi (deneme süresi + metin kümesi) gösterdiğini belirler. Aktif varyant
 * flagsStore'dan (remote config) gelir; UI yalnızca buradaki spec'i uygular.
 *
 * Ölçüm: paywall_view (varyantla) gösterimde, subscribed (varyantla) satın
 * almada izlenir → dönüşüm oranı varyant başına kıyaslanır.
 */
import type { PaywallVariant } from '../config/flags';

export interface PaywallSpec {
  variant: PaywallVariant;
  /** Ücretsiz deneme günü; 0 ise deneme rozeti gösterilmez. */
  trialDays: number;
  /** i18n metin kümesi kökü: subscription.variants.<copyKey>.* */
  copyKey: PaywallVariant;
}

export function paywallSpec(variant: PaywallVariant): PaywallSpec {
  switch (variant) {
    case 'trial7':
      return { variant, trialDays: 7, copyKey: 'trial7' };
    case 'hard':
      return { variant, trialDays: 0, copyKey: 'hard' };
    case 'control':
    default:
      return { variant: 'control', trialDays: 0, copyKey: 'control' };
  }
}
