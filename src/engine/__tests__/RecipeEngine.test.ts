/**
 * RecipeEngine birim testleri — saf motoru servissiz/UISiz doğrular.
 * node:test ile çalışır (harici bağımlılık gerekmez). Bkz. scripts/test-engine.mjs.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { RecipeEngine } from '../RecipeEngine';
import { SafetyError } from '../foodSafety';
import type { Recipe } from '../types';

/** Sahte saat: testlerin zamanı kontrol etmesini sağlar. */
function fakeClock(start = 0) {
  let now = start;
  const fn = () => now;
  fn.advance = (ms: number) => {
    now += ms;
  };
  return fn;
}

/** Paralellik + bağımlılık + güvenlik içeren küçük bir graf. */
function sampleRecipe(): Recipe {
  return {
    id: 'test',
    title: 'Test Tarifi',
    servings: 1,
    locale: 'tr',
    nodes: [
      {
        id: 'chop',
        title: 'Doğra',
        instruction: '',
        kind: 'prep',
        requires: [],
        completion: 'user',
      },
      {
        id: 'grate',
        title: 'Rendele',
        instruction: '',
        kind: 'prep',
        requires: [],
        completion: 'user',
      },
      {
        id: 'simmer',
        title: 'Pişir',
        instruction: '',
        kind: 'action',
        requires: ['chop', 'grate'],
        completion: 'timer',
        durationSec: 60,
      },
      {
        id: 'eggs',
        title: 'Yumurta',
        instruction: '',
        kind: 'finish',
        requires: ['simmer'],
        completion: 'user',
        safety: { critical: true, message: 'Yumurta iyice pişmeli.', minInternalTempC: 71 },
      },
    ],
  };
}

test('başlangıçta yalnızca bağımlılıksız düğümler hazır (paralel)', () => {
  const e = new RecipeEngine(sampleRecipe(), fakeClock());
  const snap = e.snapshot();
  assert.deepEqual(snap.ready.sort(), ['chop', 'grate']);
  assert.equal(snap.complete, false);
  assert.equal(snap.progress, 0);
});

test('iki prep adımı aynı anda aktif olabilir (paralel iş)', () => {
  const e = new RecipeEngine(sampleRecipe(), fakeClock());
  e.start('chop');
  const snap = e.start('grate');
  assert.deepEqual(snap.active.sort(), ['chop', 'grate']);
});

test('bağımlılık tamamlanınca sonraki düğüm hazır olur', () => {
  const e = new RecipeEngine(sampleRecipe(), fakeClock());
  e.start('chop');
  e.complete('chop');
  assert.equal(e.state('simmer').status, 'pending'); // grate hâlâ eksik
  e.start('grate');
  const snap = e.complete('grate');
  assert.ok(snap.ready.includes('simmer'));
});

test('zamanlayıcı motorda tutulur ve süre dolar', () => {
  const clock = fakeClock();
  const e = new RecipeEngine(sampleRecipe(), clock);
  e.complete('chop');
  e.complete('grate');
  e.start('simmer');
  assert.equal(e.remainingSec('simmer'), 60);
  clock.advance(40_000);
  assert.equal(e.remainingSec('simmer'), 20);
  assert.equal(e.isExpired('simmer'), false);
  clock.advance(25_000);
  assert.equal(e.remainingSec('simmer'), 0);
  assert.equal(e.isExpired('simmer'), true);
});

test('duraklatma kalan süreyi dondurur, devam kaydırır', () => {
  const clock = fakeClock();
  const e = new RecipeEngine(sampleRecipe(), clock);
  e.complete('chop');
  e.complete('grate');
  e.start('simmer');
  clock.advance(20_000);
  assert.equal(e.remainingSec('simmer'), 40);

  e.pauseTimers();
  assert.equal(e.isPaused, true);
  clock.advance(60_000); // duraklatma sırasında geçen zaman sayılmaz
  assert.equal(e.remainingSec('simmer'), 40);
  assert.equal(e.isExpired('simmer'), false);

  e.resumeTimers();
  assert.equal(e.isPaused, false);
  assert.equal(e.remainingSec('simmer'), 40);
  clock.advance(40_000);
  assert.equal(e.remainingSec('simmer'), 0);
});

test('kurtarma: fail → retry düğümü yeniden hazır yapar', () => {
  const e = new RecipeEngine(sampleRecipe(), fakeClock());
  e.start('chop');
  e.fail('chop');
  assert.equal(e.state('chop').status, 'failed');
  e.retry('chop');
  assert.equal(e.state('chop').status, 'ready');
});

test('kritik güvenlik adımı atlanamaz (SafetyError)', () => {
  const e = new RecipeEngine(sampleRecipe(), fakeClock());
  e.complete('chop');
  e.complete('grate');
  e.complete('simmer');
  assert.throws(() => e.skip('eggs'), SafetyError);
});

test('kritik olmayan adım atlanabilir ve bağımlılığı serbest bırakır', () => {
  const e = new RecipeEngine(sampleRecipe(), fakeClock());
  e.skip('chop');
  e.complete('grate');
  assert.ok(e.snapshot().ready.includes('simmer'));
});

test('tüm atlanmamış düğümler bitince tarif tamamlanır', () => {
  const e = new RecipeEngine(sampleRecipe(), fakeClock());
  e.complete('chop');
  e.complete('grate');
  e.complete('simmer');
  const snap = e.complete('eggs');
  assert.equal(snap.complete, true);
  assert.equal(snap.progress, 1);
});

test('döngü içeren graf reddedilir', () => {
  const cyclic: Recipe = {
    id: 'c',
    title: 'c',
    servings: 1,
    locale: 'tr',
    nodes: [
      { id: 'a', title: 'a', instruction: '', kind: 'prep', requires: ['b'], completion: 'user' },
      { id: 'b', title: 'b', instruction: '', kind: 'prep', requires: ['a'], completion: 'user' },
    ],
  };
  assert.throws(() => new RecipeEngine(cyclic, fakeClock()), /döngü/);
});
