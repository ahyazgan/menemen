/**
 * Yaşam döngüsü (re-engagement) bildirimlerini planlar. Saf plan mantığı
 * recipes/reengage.ts'te ve testli; burada yalnızca store'lardan veri toplama +
 * bildirim servisine bağlama. Açılışta ve her tamamlanan yemekte çağrılır
 * (eski dürtüler iptal edilip yeniden planlanır → "son etkinlik" referansı).
 */
import { planNudges } from '../recipes/reengage';
import { computeStreak, toDayNumber } from '../recipes/streak';
import { useStreakStore } from './streakStore';
import { useUiStore } from './uiStore';
import { useCookingStore } from './cookingStore';
import { getFlags } from './flagsStore';
import { track } from '../services/analytics';
import { t } from '../i18n';

const NUDGE_IDS = ['nudge.dinner', 'nudge.comeback'];

export async function rescheduleNudges(): Promise<void> {
  const notify = useCookingStore.getState().notify;
  // Her zaman önce eski dürtüleri temizle (kapalıysa da temiz kalsın).
  await Promise.all(NUDGE_IDS.map((id) => notify.cancel(id)));
  if (!getFlags().lifecycleNudges || !useUiStore.getState().nudgesEnabled) return;
  const granted = await notify.requestPermission();
  if (!granted) return;

  const today = toDayNumber(Date.now());
  const { cookedToday } = computeStreak(useStreakStore.getState().days, today);
  const tzOffsetMinutes = -new Date().getTimezoneOffset(); // yerel = UTC + offset
  const plans = planNudges({ now: Date.now(), cookedToday, tzOffsetMinutes });

  for (const p of plans) {
    await notify.schedule({
      id: p.id,
      title: t(`nudge.${p.kind}.title`),
      body: t(`nudge.${p.kind}.body`),
      inSeconds: p.inSeconds,
    });
    track({ name: 'nudge_scheduled', kind: p.kind });
  }
}
