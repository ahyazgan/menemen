/**
 * Zamanlayıcı bildirimi yardımcıları (saf — platformdan bağımsız). Native
 * planlama services/notify altında; burada yalnızca "hangi düğüm, ne zaman,
 * hangi metin" kararı üretilir, böylece test edilebilir.
 */
import type { RecipeNode } from './types';
import { localize } from './localize';

export interface TimerNotification {
  id: string;
  title: string;
  body: string;
  /** Şu andan itibaren kaç saniye sonra. Daima >= 1. */
  inSeconds: number;
}

/** Düğüm süreli (timer) ve süresi pozitif mi? Yalnızca bunlar bildirim alır. */
export function isTimerNode(node: RecipeNode): boolean {
  return (
    node.completion === 'timer' && typeof node.durationSec === 'number' && node.durationSec > 0
  );
}

/** Düğüm için kararlı bildirim kimliği (planla/iptal eşleşmesi). */
export function timerNotificationId(nodeId: string): string {
  return `timer:${nodeId}`;
}

/**
 * Süreli düğüm için bildirim açıklaması üretir. `body` i18n'den enjekte edilir;
 * `remainingSec` verilmezse düğümün tam süresi kullanılır. Süre en az 1 sn'ye
 * yuvarlanır (geçmiş/0 değer planlanamaz).
 */
export function buildTimerNotification(
  node: RecipeNode,
  locale: string,
  body: string,
  remainingSec?: number,
): TimerNotification {
  const seconds = remainingSec ?? node.durationSec ?? 0;
  return {
    id: timerNotificationId(node.id),
    title: localize(node.title, locale),
    body,
    inSeconds: Math.max(1, Math.ceil(seconds)),
  };
}
