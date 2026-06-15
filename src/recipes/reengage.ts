/**
 * Yaşam döngüsü (re-engagement) bildirim planı için saf mantık — retention.
 * Yalnızca NE ZAMAN/HANGİ tür hesaplanır; metin (i18n) ve zamanlama servisi
 * çağıran taraftadır. Deterministik → test edilebilir.
 *
 * İki dürtü:
 *  - dinner: bugün pişirilmediyse, yerel akşam yemeği saatinde "ne pişsek?"
 *  - comeback: son etkinlikten N gün sonra "seni özledik"
 */
export type NudgeKind = 'dinner' | 'comeback';

export interface NudgePlan {
  id: string;
  kind: NudgeKind;
  /** Şu andan itibaren saniye (>= 1). */
  inSeconds: number;
}

export interface ReengageInput {
  now: number;
  cookedToday: boolean;
  /** Yerel = UTC + offset dakika (TR için +180). */
  tzOffsetMinutes?: number;
  /** Akşam dürtüsü saati (0-23, yerel). */
  dinnerHour?: number;
  /** "Geri dön" dürtüsü kaç gün sonra. */
  comebackDays?: number;
}

const MS_DAY = 86_400_000;

/** Verilen yerel saate kadar kalan saniye (geçtiyse ertesi güne sarar, >= 1). */
export function secondsUntilLocalHour(now: number, hour: number, tzOffsetMinutes: number): number {
  const localMs = now + tzOffsetMinutes * 60_000;
  const msIntoDay = ((localMs % MS_DAY) + MS_DAY) % MS_DAY;
  let target = hour * 3_600_000 - msIntoDay;
  if (target <= 0) target += MS_DAY;
  return Math.max(1, Math.ceil(target / 1000));
}

export function planNudges(input: ReengageInput): NudgePlan[] {
  const tz = input.tzOffsetMinutes ?? 0;
  const dinnerHour = input.dinnerHour ?? 18;
  const comebackDays = input.comebackDays ?? 3;
  const plans: NudgePlan[] = [];
  // Bugün zaten pişirdiyse akşam dürtüsüyle rahatsız etme.
  if (!input.cookedToday) {
    plans.push({
      id: 'nudge.dinner',
      kind: 'dinner',
      inSeconds: secondsUntilLocalHour(input.now, dinnerHour, tz),
    });
  }
  plans.push({
    id: 'nudge.comeback',
    kind: 'comeback',
    inSeconds: Math.max(1, comebackDays * 86_400),
  });
  return plans;
}
