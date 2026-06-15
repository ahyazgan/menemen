/** Re-engagement bildirim planı — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { planNudges, secondsUntilLocalHour } from '../reengage';

test('secondsUntilLocalHour: gün başında 18:00 64800 sn', () => {
  assert.equal(secondsUntilLocalHour(0, 18, 0), 18 * 3600);
});

test('secondsUntilLocalHour: hedef saat geçtiyse ertesi güne sarar', () => {
  const now = 20 * 3_600_000; // yerel 20:00 (tz=0)
  assert.equal(secondsUntilLocalHour(now, 18, 0), 22 * 3600);
});

test('secondsUntilLocalHour: tam hedef saatte tam gün sonrasını verir', () => {
  const now = 18 * 3_600_000;
  assert.equal(secondsUntilLocalHour(now, 18, 0), 24 * 3600);
});

test('secondsUntilLocalHour: zaman dilimi kaydırması uygulanır', () => {
  // UTC 00:00, tz +180 (yerel 03:00); yerel 18:00'a 15 saat var.
  assert.equal(secondsUntilLocalHour(0, 18, 180), 15 * 3600);
});

test('bugün pişirilmediyse hem dinner hem comeback planlanır', () => {
  const plans = planNudges({ now: 0, cookedToday: false, tzOffsetMinutes: 0 });
  assert.deepEqual(
    plans.map((p) => p.kind),
    ['dinner', 'comeback'],
  );
});

test('bugün pişirildiyse yalnızca comeback planlanır', () => {
  const plans = planNudges({ now: 0, cookedToday: true });
  assert.deepEqual(
    plans.map((p) => p.kind),
    ['comeback'],
  );
});

test('comeback gün sayısına göre saniye verir', () => {
  const plans = planNudges({ now: 0, cookedToday: true, comebackDays: 2 });
  assert.equal(plans[0]?.inSeconds, 2 * 86_400);
});
