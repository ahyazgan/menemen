import test from 'node:test';
import assert from 'node:assert/strict';

import { createJwksCache } from '../jwksCache.mjs';

function fakeClock(start = 0) {
  let t = start;
  const fn = () => t;
  fn.advance = (ms) => {
    t += ms;
  };
  return fn;
}

test('ilk get fetcher çağırır ve değeri döndürür', async () => {
  let calls = 0;
  const cache = createJwksCache({ fetcher: async () => ({ keys: [++calls] }), ttlMs: 1000, now: fakeClock() });
  const v = await cache.get();
  assert.deepEqual(v, { keys: [1] });
  assert.equal(calls, 1);
});

test('TTL içinde önbellekten döner (fetcher tekrar çağrılmaz)', async () => {
  let calls = 0;
  const clock = fakeClock();
  const cache = createJwksCache({ fetcher: async () => ({ keys: [++calls] }), ttlMs: 1000, now: clock });
  await cache.get();
  clock.advance(500);
  await cache.get();
  assert.equal(calls, 1);
});

test('TTL sonrası yeniden çeker', async () => {
  let calls = 0;
  const clock = fakeClock();
  const cache = createJwksCache({ fetcher: async () => ({ keys: [++calls] }), ttlMs: 1000, now: clock });
  await cache.get();
  clock.advance(1000);
  await cache.get();
  assert.equal(calls, 2);
});

test('eşzamanlı get tek fetch yapar (inflight dedup)', async () => {
  let calls = 0;
  const cache = createJwksCache({
    fetcher: async () => {
      calls += 1;
      await new Promise((r) => setTimeout(r, 10));
      return { keys: [calls] };
    },
    ttlMs: 1000,
    now: fakeClock(),
  });
  const [a, b] = await Promise.all([cache.get(), cache.get()]);
  assert.equal(calls, 1);
  assert.deepEqual(a, b);
});
