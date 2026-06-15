/** Pişirme serisi yardımcıları — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { computeStreak, recordCookDay, toDayNumber } from '../streak';

test('toDayNumber aynı gün için sabit, ertesi gün +1', () => {
  const a = toDayNumber(1_700_000_000_000);
  const b = toDayNumber(1_700_000_000_000 + 3_600_000); // +1 saat
  const c = toDayNumber(1_700_000_000_000 + 86_400_000); // +1 gün
  assert.equal(a, b);
  assert.equal(c, a + 1);
});

test('recordCookDay ekler, yinelemez, sıralar', () => {
  let d: number[] = [];
  d = recordCookDay(d, 5);
  d = recordCookDay(d, 3);
  d = recordCookDay(d, 5); // yineleme
  assert.deepEqual(d, [3, 5]);
});

test('boş geçmişte tüm değerler sıfır', () => {
  assert.deepEqual(computeStreak([], 100), {
    current: 0,
    longest: 0,
    cookedToday: false,
    weeklyCount: 0,
  });
});

test('bugün dahil ardışık günler güncel seriyi verir', () => {
  const s = computeStreak([98, 99, 100], 100);
  assert.equal(s.current, 3);
  assert.equal(s.cookedToday, true);
  assert.equal(s.longest, 3);
  assert.equal(s.weeklyCount, 3);
});

test('dün pişirildi ama bugün değilse seri hâlâ canlı (cookedToday false)', () => {
  const s = computeStreak([98, 99], 100);
  assert.equal(s.current, 2);
  assert.equal(s.cookedToday, false);
});

test('iki gün önceden beri pişirilmediyse güncel seri sıfır', () => {
  const s = computeStreak([97, 98], 100);
  assert.equal(s.current, 0);
  assert.equal(s.longest, 2);
});

test('boşluk en uzun seriyi günceli aşacak şekilde yakalar', () => {
  // 90-92 (3'lü) ... boşluk ... 99-100 (2'li, güncel)
  const s = computeStreak([90, 91, 92, 99, 100], 100);
  assert.equal(s.current, 2);
  assert.equal(s.longest, 3);
});

test('weeklyCount yalnızca son 7 günü sayar', () => {
  const s = computeStreak([90, 94, 98, 99, 100], 100); // 90 ve 94 pencere dışı/içi
  // pencere: 94..100 → 94,98,99,100 = 4
  assert.equal(s.weeklyCount, 4);
});
