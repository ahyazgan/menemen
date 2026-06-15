import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

import { createLiveKitToken, decodeJwtPayload } from '../livekitToken.mjs';

const OPTS = {
  apiKey: 'APIxxx',
  apiSecret: 'secret-123',
  identity: 'user-1',
  room: 'cook-menemen',
};

test('üç parçalı JWT üretir', () => {
  const token = createLiveKitToken(OPTS);
  assert.equal(token.split('.').length, 3);
});

test('payload doğru iss/sub ve video grant taşır', () => {
  const token = createLiveKitToken(OPTS);
  const p = decodeJwtPayload(token);
  assert.equal(p.iss, 'APIxxx');
  assert.equal(p.sub, 'user-1');
  assert.equal(p.video.room, 'cook-menemen');
  assert.equal(p.video.roomJoin, true);
  assert.ok(p.exp > p.nbf);
});

test('imza secret ile doğrulanabilir (HS256)', () => {
  const token = createLiveKitToken(OPTS);
  const [head, body, sig] = token.split('.');
  const expected = createHmac('sha256', OPTS.apiSecret)
    .update(`${head}.${body}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  assert.equal(sig, expected);
});

test('ttlSeconds exp süresini belirler', () => {
  const p = decodeJwtPayload(createLiveKitToken({ ...OPTS, ttlSeconds: 120 }));
  assert.equal(p.exp - p.nbf, 120);
});

test('anahtar/secret eksikse hata fırlatır', () => {
  assert.throws(() => createLiveKitToken({ ...OPTS, apiSecret: '' }), /secret/i);
});

test('metadata verilirse payload’a eklenir', () => {
  const p = decodeJwtPayload(createLiveKitToken({ ...OPTS, metadata: '{"step":"x"}' }));
  assert.equal(p.metadata, '{"step":"x"}');
});
