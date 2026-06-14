import test from 'node:test';
import assert from 'node:assert/strict';

import { signHS256, verifyHS256 } from '../jwt.mjs';

const SECRET = 'test-secret';
const fixedNow = () => 1_000_000_000_000; // sabit saat (ms)
const nowSec = Math.floor(fixedNow() / 1000);

test('geçerli token doğrulanır ve payload döner', () => {
  const token = signHS256({ sub: 'user-1', exp: nowSec + 60 }, SECRET);
  const result = verifyHS256(token, SECRET, { now: fixedNow });
  assert.equal(result.valid, true);
  assert.equal(result.valid && result.payload.sub, 'user-1');
});

test('yanlış sır imzayı reddeder', () => {
  const token = signHS256({ sub: 'user-1', exp: nowSec + 60 }, SECRET);
  const result = verifyHS256(token, 'wrong-secret', { now: fixedNow });
  assert.equal(result.valid, false);
  assert.equal(result.valid === false && result.reason, 'bad_signature');
});

test('süresi geçmiş token reddedilir', () => {
  const token = signHS256({ sub: 'user-1', exp: nowSec - 1 }, SECRET);
  const result = verifyHS256(token, SECRET, { now: fixedNow });
  assert.equal(result.valid, false);
  assert.equal(result.valid === false && result.reason, 'expired');
});

test('HS256 dışı algoritma reddedilir', () => {
  const token = signHS256({ sub: 'x' }, SECRET, { alg: 'none', typ: 'JWT' });
  const result = verifyHS256(token, SECRET, { now: fixedNow });
  assert.equal(result.valid, false);
  assert.equal(result.valid === false && result.reason, 'unsupported_alg');
});

test('bozuk token reddedilir', () => {
  assert.equal(verifyHS256('abc.def', SECRET, { now: fixedNow }).valid, false);
  assert.equal(verifyHS256('', SECRET, { now: fixedNow }).valid, false);
});

test('nbf gelecekteyse reddedilir', () => {
  const token = signHS256({ sub: 'x', nbf: nowSec + 60 }, SECRET);
  const result = verifyHS256(token, SECRET, { now: fixedNow });
  assert.equal(result.valid, false);
  assert.equal(result.valid === false && result.reason, 'not_yet_valid');
});
