/** Mağaza puanı kapısı — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { shouldRequestReview } from '../review';

test('2 yemekten az tamamlandıysa istenmez', () => {
  assert.equal(
    shouldRequestReview({
      completedCookCount: 1,
      lastPromptedVersion: null,
      currentVersion: '1.0',
    }),
    false,
  );
});

test('2+ yemek ve bu sürümde sorulmadıysa istenir', () => {
  assert.equal(
    shouldRequestReview({
      completedCookCount: 2,
      lastPromptedVersion: null,
      currentVersion: '1.0',
    }),
    true,
  );
});

test('aynı sürümde tekrar istenmez', () => {
  assert.equal(
    shouldRequestReview({
      completedCookCount: 5,
      lastPromptedVersion: '1.0',
      currentVersion: '1.0',
    }),
    false,
  );
});

test('yeni sürümde tekrar istenebilir', () => {
  assert.equal(
    shouldRequestReview({
      completedCookCount: 5,
      lastPromptedVersion: '1.0',
      currentVersion: '1.1',
    }),
    true,
  );
});
