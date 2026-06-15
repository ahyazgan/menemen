/** withTimeout — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { withTimeout, TimeoutError } from '../async';

test('zamanında çözülen değeri döndürür', async () => {
  const r = await withTimeout(Promise.resolve(42), 50);
  assert.equal(r, 42);
});

test('süre aşılırsa TimeoutError ile reddeder', async () => {
  const never = new Promise<number>(() => {});
  let err: unknown;
  try {
    await withTimeout(never, 10);
  } catch (e) {
    err = e;
  }
  assert.ok(err instanceof TimeoutError);
});

test('asıl hata korunur (timeout değilse)', async () => {
  let msg = '';
  try {
    await withTimeout(Promise.reject(new Error('patladı')), 50);
  } catch (e) {
    msg = e instanceof Error ? e.message : String(e);
  }
  assert.ok(msg.includes('patladı'));
});
