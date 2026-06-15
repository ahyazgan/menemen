/** Süre biçimlendirme — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { formatDuration } from '../format';

test('formatDuration dakika:saniye', () => {
  assert.equal(formatDuration(0), '0:00');
  assert.equal(formatDuration(5), '0:05');
  assert.equal(formatDuration(65), '1:05');
  assert.equal(formatDuration(600), '10:00');
  assert.equal(formatDuration(2100), '35:00');
});

test('formatDuration negatif/ondalık güvenli', () => {
  assert.equal(formatDuration(-10), '0:00');
  assert.equal(formatDuration(59.9), '0:59');
});
