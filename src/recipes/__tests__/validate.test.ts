/** Uzak tarif doğrulaması — saf testler (güvenilmez içerik). */
import test from 'node:test';
import assert from 'node:assert/strict';

import { parseRemoteRecipes, validateRecipe } from '../validate';

// Test için gevşek (mutasyona açık) tarif şekli — geçersiz değerleri de tutabilir.
interface RawNode {
  id: string;
  title: string;
  instruction: string;
  kind: string;
  requires: string[];
  completion: string;
  durationSec?: number;
  safety?: { critical: unknown; message: string; minInternalTempC?: number };
}
interface RawRecipe {
  id: string;
  title: Record<string, string>;
  servings: number;
  locale: string;
  nodes: RawNode[];
}

function validRecipe(): RawRecipe {
  return {
    id: 'remote-1',
    title: { tr: 'Uzak Tarif', en: 'Remote Recipe' },
    servings: 2,
    locale: 'tr',
    nodes: [
      {
        id: 'a',
        title: 'A',
        instruction: 'Adım A',
        kind: 'prep',
        requires: [],
        completion: 'user',
      },
      {
        id: 'b',
        title: 'B',
        instruction: 'Adım B',
        kind: 'action',
        requires: ['a'],
        completion: 'timer',
        durationSec: 60,
      },
    ],
  };
}

test('geçerli tarif kabul edilir', () => {
  const r = validateRecipe(validRecipe());
  assert.ok(r);
  assert.equal(r?.id, 'remote-1');
  assert.equal(r?.nodes.length, 2);
});

test('eksik alanlar reddedilir', () => {
  assert.equal(validateRecipe(null), null);
  assert.equal(validateRecipe({ id: 'x' }), null);
  assert.equal(validateRecipe({ ...validRecipe(), servings: 0 }), null);
  assert.equal(validateRecipe({ ...validRecipe(), nodes: [] }), null);
});

test('bilinmeyen bağımlılık (geçersiz graf) reddedilir', () => {
  const bad = validRecipe();
  bad.nodes[1]!.requires = ['yok'];
  assert.equal(validateRecipe(bad), null);
});

test('döngülü graf reddedilir', () => {
  const bad = validRecipe();
  bad.nodes[0]!.requires = ['b'];
  bad.nodes[1]!.requires = ['a'];
  assert.equal(validateRecipe(bad), null);
});

test('geçersiz completion/kind reddedilir', () => {
  const bad = validRecipe();
  bad.nodes[0]!.completion = 'uydurma';
  assert.equal(validateRecipe(bad), null);
});

test('bozuk safety reddedilir, geçerli safety korunur', () => {
  const badSafety = validRecipe();
  badSafety.nodes[1]!.safety = { critical: 'evet', message: 'm' };
  assert.equal(validateRecipe(badSafety), null);

  const okSafety = validRecipe();
  okSafety.nodes[1]!.safety = { critical: true, message: 'İyice pişir', minInternalTempC: 74 };
  const r = validateRecipe(okSafety);
  assert.equal(r?.nodes[1]?.safety?.critical, true);
  assert.equal(r?.nodes[1]?.safety?.minInternalTempC, 74);
});

test('parseRemoteRecipes geçersizleri eler, geçerlileri tutar', () => {
  const out = parseRemoteRecipes([validRecipe(), null, { id: 'x' }, validRecipe()]);
  assert.equal(out.length, 2);
});

test('parseRemoteRecipes dizi değilse boş döner', () => {
  assert.deepEqual(parseRemoteRecipes('bozuk'), []);
  assert.deepEqual(parseRemoteRecipes(null), []);
});
