/** Paywall A/B varyant mantığı — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { paywallSpec } from '../paywall';

test('trial7 yedi günlük deneme verir', () => {
  const s = paywallSpec('trial7');
  assert.equal(s.trialDays, 7);
  assert.equal(s.copyKey, 'trial7');
});

test('hard varyantta deneme yok', () => {
  const s = paywallSpec('hard');
  assert.equal(s.trialDays, 0);
  assert.equal(s.copyKey, 'hard');
});

test('control varsayılan, denemesiz', () => {
  const s = paywallSpec('control');
  assert.equal(s.trialDays, 0);
  assert.equal(s.variant, 'control');
});
