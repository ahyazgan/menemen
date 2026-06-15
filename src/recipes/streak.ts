/**
 * Pişirme serisi (streak) için saf yardımcılar — alışkanlık döngüsü/retention.
 * Gün = epoch'tan beri tam UTC günü (deterministik, test edilebilir). Kalıcılık
 * streakStore'da; burada yalnızca hesap.
 */
const DAY_MS = 86_400_000;

export interface StreakInfo {
  /** Bugüne (yoksa düne) kadar ardışık pişirme günü sayısı. */
  current: number;
  /** Tüm zamanların en uzun serisi. */
  longest: number;
  /** Bugün pişirildi mi? */
  cookedToday: boolean;
  /** Son 7 gün (bugün dahil) içindeki pişirme günü sayısı. */
  weeklyCount: number;
}

/** ms epoch → UTC gün numarası. */
export function toDayNumber(ms: number): number {
  return Math.floor(ms / DAY_MS);
}

/** Bir pişirme gününü ekle (yinelenmez, artan sıralı). */
export function recordCookDay(days: readonly number[], day: number): number[] {
  if (days.includes(day)) return [...days];
  return [...days, day].sort((a, b) => a - b);
}

export function computeStreak(days: readonly number[], today: number): StreakInfo {
  const set = new Set(days);
  const cookedToday = set.has(today);

  // Güncel seri: bugünden (yoksa dünden) geriye doğru ardışık günler.
  let current = 0;
  let cursor = cookedToday ? today : today - 1;
  while (set.has(cursor)) {
    current++;
    cursor--;
  }

  // En uzun ardışık seri.
  const sorted = [...set].sort((a, b) => a - b);
  let longest = 0;
  let run = 0;
  let prev: number | null = null;
  for (const d of sorted) {
    run = prev !== null && d === prev + 1 ? run + 1 : 1;
    if (run > longest) longest = run;
    prev = d;
  }

  // Son 7 gün içindeki pişirme günü sayısı.
  let weeklyCount = 0;
  for (let i = 0; i < 7; i++) if (set.has(today - i)) weeklyCount++;

  return { current, longest, cookedToday, weeklyCount };
}
