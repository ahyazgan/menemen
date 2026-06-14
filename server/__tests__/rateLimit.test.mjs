import test from 'node:test';
import assert from 'node:assert/strict';

import { createRateLimiter } from '../rateLimit.mjs';

function fakeClock(start = 0) {
  let t = start;
  const fn = () => t;
  fn.advance = (ms) => {
    t += ms;
  };
  return fn;
}

test('limit altında istekler geçer', () => {
  const limiter = createRateLimiter({ limit: 3, windowMs: 1000, now: fakeClock() });
  assert.equal(limiter.check('a').allowed, true);
  assert.equal(limiter.check('a').allowed, true);
  const third = limiter.check('a');
  assert.equal(third.allowed, true);
  assert.equal(third.remaining, 0);
});

test('limit aşılınca engellenir ve retryAfter verir', () => {
  const clock = fakeClock();
  const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: clock });
  limiter.check('a');
  limiter.check('a');
  const blocked = limiter.check('a');
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterMs > 0);
});

test('pencere dolunca sayaç sıfırlanır', () => {
  const clock = fakeClock();
  const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: clock });
  assert.equal(limiter.check('a').allowed, true);
  assert.equal(limiter.check('a').allowed, false);
  clock.advance(1000);
  assert.equal(limiter.check('a').allowed, true);
});

test('farklı anahtarlar bağımsız sayılır', () => {
  const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: fakeClock() });
  assert.equal(limiter.check('a').allowed, true);
  assert.equal(limiter.check('b').allowed, true);
  assert.equal(limiter.check('a').allowed, false);
});
