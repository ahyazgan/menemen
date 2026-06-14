import test from 'node:test';
import assert from 'node:assert/strict';

import { contentLengthExceeds } from '../bodyLimit.mjs';

test('başlık yoksa aşmaz', () => {
  assert.equal(contentLengthExceeds(undefined, 100), false);
  assert.equal(contentLengthExceeds(null, 100), false);
});

test('limit altında/üstünde doğru karar', () => {
  assert.equal(contentLengthExceeds('50', 100), false);
  assert.equal(contentLengthExceeds('100', 100), false);
  assert.equal(contentLengthExceeds('101', 100), true);
});

test('sayı olmayan başlık aşmaz (akış muhafızı devreye girer)', () => {
  assert.equal(contentLengthExceeds('abc', 100), false);
});
