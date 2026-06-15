/**
 * SubscriptionGate — REQUIRE_SUBSCRIPTION açıkken ve kullanıcı abone değilken
 * Paywall'ı, aksi halde içeriği gösterir. Dev'de REQUIRE_SUBSCRIPTION=false
 * olduğundan içerik her zaman görünür.
 */
import { useEffect, type ReactNode } from 'react';

import { useSubscriptionStore } from '../state/subscriptionStore';
import { getFlags } from '../state/flagsStore';
import { track } from '../services/analytics';
import { REQUIRE_SUBSCRIPTION } from '../config';
import { Paywall } from './Paywall';

export function SubscriptionGate({ children }: { children: ReactNode }) {
  const subscribed = useSubscriptionStore((s) => s.subscribed);
  const init = useSubscriptionStore((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  const showPaywall = REQUIRE_SUBSCRIPTION && !subscribed;

  // Paywall görüntüleme olayını (varyantıyla) bir kez kaydet — A/B ölçümü.
  useEffect(() => {
    if (showPaywall) track({ name: 'paywall_view', variant: getFlags().paywallVariant });
  }, [showPaywall]);

  if (showPaywall) {
    return <Paywall />;
  }
  return <>{children}</>;
}
