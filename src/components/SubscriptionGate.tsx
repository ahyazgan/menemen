/**
 * SubscriptionGate — REQUIRE_SUBSCRIPTION açıkken ve kullanıcı abone değilken
 * Paywall'ı, aksi halde içeriği gösterir. Dev'de REQUIRE_SUBSCRIPTION=false
 * olduğundan içerik her zaman görünür.
 */
import { useEffect, type ReactNode } from 'react';

import { useSubscriptionStore } from '../state/subscriptionStore';
import { REQUIRE_SUBSCRIPTION } from '../config';
import { Paywall } from './Paywall';

export function SubscriptionGate({ children }: { children: ReactNode }) {
  const subscribed = useSubscriptionStore((s) => s.subscribed);
  const init = useSubscriptionStore((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  if (REQUIRE_SUBSCRIPTION && !subscribed) {
    return <Paywall />;
  }
  return <>{children}</>;
}
