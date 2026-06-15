/** Yerel niyet ayrıştırma — saf testler (TR + EN). */
import test from 'node:test';
import assert from 'node:assert/strict';

import { matchIntent } from '../intent';

test('TR komutları', () => {
  assert.equal(matchIntent('tamam bitti').kind, 'next');
  assert.equal(matchIntent('tekrar eder misin').kind, 'repeat');
  assert.equal(matchIntent('ne kadar kaldı').kind, 'how_long');
  assert.equal(matchIntent('şimdi ne yapayım').kind, 'what_now');
  assert.equal(matchIntent('malzemeler neydi').kind, 'ingredients');
  assert.equal(matchIntent('biraz dur').kind, 'pause');
  assert.equal(matchIntent('bir bak bakalım').kind, 'check');
});

test('EN komutları', () => {
  assert.equal(matchIntent('ok next').kind, 'next');
  assert.equal(matchIntent('say again').kind, 'repeat');
  assert.equal(matchIntent('how long left').kind, 'how_long');
  assert.equal(matchIntent('what now').kind, 'what_now');
  assert.equal(matchIntent('pause please').kind, 'pause');
  assert.equal(matchIntent('can you check').kind, 'check');
});

test('kurtarma yalnızca adımda tanımlıysa', () => {
  // anahtar tanımlı → recovery
  const r = matchIntent('galiba yaktım', ['yaktim']);
  assert.equal(r.kind, 'recovery');
  assert.equal(r.recoveryKey, 'yaktim');
  // anahtar tanımlı değil → recovery'ye düşmez
  assert.ok(matchIntent('yaktım', []).kind !== 'recovery');
});

test('EN kurtarma', () => {
  assert.equal(matchIntent('it is too salty', ['tuzlu']).kind, 'recovery');
  assert.equal(matchIntent('too watery', ['sulu']).recoveryKey, 'sulu');
});

test('eşleşmeyen → unknown (düşük güven)', () => {
  const r = matchIntent('xyzyok böyle bir şey');
  assert.equal(r.kind, 'unknown');
  assert.ok(r.confidence < 0.5);
});
