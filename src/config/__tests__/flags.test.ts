/** Feature flag birleştirme — saf testler. Remote config güvenilmez girdidir. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULT_FLAGS, sanitizeFlags } from '../flags';

test('geçersiz girdide varsayılanlar döner', () => {
  assert.deepEqual(sanitizeFlags(null), DEFAULT_FLAGS);
  assert.deepEqual(sanitizeFlags('bozuk'), DEFAULT_FLAGS);
  assert.deepEqual(sanitizeFlags(42), DEFAULT_FLAGS);
});

test('yalnızca geçerli alanlar override edilir, eksikler varsayılanda kalır', () => {
  const out = sanitizeFlags({ streaks: false, referral: true });
  assert.equal(out.streaks, false);
  assert.equal(out.referral, true);
  assert.equal(out.reviewPrompt, DEFAULT_FLAGS.reviewPrompt);
});

test('yanlış tipli alan yok sayılır', () => {
  const out = sanitizeFlags({ streaks: 'evet', lifecycleNudges: 1 });
  assert.equal(out.streaks, DEFAULT_FLAGS.streaks);
  assert.equal(out.lifecycleNudges, DEFAULT_FLAGS.lifecycleNudges);
});

test('paywall varyantı yalnızca bilinen değerlerden olur', () => {
  assert.equal(sanitizeFlags({ paywallVariant: 'trial7' }).paywallVariant, 'trial7');
  assert.equal(sanitizeFlags({ paywallVariant: 'uydurma' }).paywallVariant, 'control');
});
