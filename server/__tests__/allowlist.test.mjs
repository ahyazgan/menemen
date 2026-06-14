import test from 'node:test';
import assert from 'node:assert/strict';

import { ALLOWLIST, isAllowed } from '../allowlist.mjs';

test('izin verilen method+yol geçer', () => {
  assert.equal(isAllowed(ALLOWLIST['/anthropic'], 'POST', '/v1/messages'), true);
  assert.equal(isAllowed(ALLOWLIST['/deepgram'], 'POST', '/v1/listen'), true);
  assert.equal(isAllowed(ALLOWLIST['/elevenlabs'], 'POST', '/v1/text-to-speech/abc123'), true);
});

test('yanlış method reddedilir', () => {
  assert.equal(isAllowed(ALLOWLIST['/anthropic'], 'GET', '/v1/messages'), false);
  assert.equal(isAllowed(ALLOWLIST['/deepgram'], 'DELETE', '/v1/listen'), false);
});

test('izinsiz yol reddedilir', () => {
  assert.equal(isAllowed(ALLOWLIST['/anthropic'], 'POST', '/v1/models'), false);
  assert.equal(isAllowed(ALLOWLIST['/anthropic'], 'POST', '/v1/messages/extra'), false);
  assert.equal(isAllowed(ALLOWLIST['/elevenlabs'], 'POST', '/v1/text-to-speech/a/b'), false);
});

test('kural yoksa reddedilir', () => {
  assert.equal(isAllowed(undefined, 'POST', '/v1/messages'), false);
  assert.equal(isAllowed(ALLOWLIST['/bilinmeyen'], 'POST', '/x'), false);
});
