import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';

import { signRS256, verifyRS256, verifyJwtWithJwks } from '../jwt.mjs';

const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const pubPem = publicKey.export({ type: 'spki', format: 'pem' });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'k1', alg: 'RS256', use: 'sig' };

const fixedNow = () => 1_000_000_000_000;
const nowSec = Math.floor(fixedNow() / 1000);

test('RS256: geçerli token PEM ile doğrulanır', () => {
  const token = signRS256({ sub: 'u1', exp: nowSec + 60 }, privateKey);
  const r = verifyRS256(token, pubPem, { now: fixedNow });
  assert.equal(r.valid, true);
  assert.equal(r.valid && r.payload.sub, 'u1');
});

test('RS256: JWK ile de doğrulanır', () => {
  const token = signRS256({ sub: 'u2', exp: nowSec + 60 }, privateKey);
  const r = verifyRS256(token, jwk, { now: fixedNow });
  assert.equal(r.valid, true);
});

test('RS256: kurcalanmış imza reddedilir', () => {
  const token = signRS256({ sub: 'u1', exp: nowSec + 60 }, privateKey);
  const tampered = token.slice(0, -3) + 'AAA';
  assert.equal(verifyRS256(tampered, pubPem, { now: fixedNow }).valid, false);
});

test('RS256: süresi geçmiş reddedilir', () => {
  const token = signRS256({ sub: 'u1', exp: nowSec - 1 }, privateKey);
  const r = verifyRS256(token, pubPem, { now: fixedNow });
  assert.equal(r.valid, false);
  assert.equal(r.valid === false && r.reason, 'expired');
});

test('JWKS: kid eşleşmesiyle doğrular', () => {
  const token = signRS256({ sub: 'u1', exp: nowSec + 60 }, privateKey, {
    alg: 'RS256',
    typ: 'JWT',
    kid: 'k1',
  });
  const r = verifyJwtWithJwks(token, { keys: [jwk] }, { now: fixedNow });
  assert.equal(r.valid, true);
});

test('JWKS: bilinmeyen kid reddedilir', () => {
  const token = signRS256({ sub: 'u1', exp: nowSec + 60 }, privateKey, {
    alg: 'RS256',
    typ: 'JWT',
    kid: 'nope',
  });
  const r = verifyJwtWithJwks(token, { keys: [jwk] }, { now: fixedNow });
  assert.equal(r.valid, false);
  assert.equal(r.valid === false && r.reason, 'unknown_kid');
});
