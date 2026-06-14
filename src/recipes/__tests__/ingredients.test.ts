/** Malzeme ölçekleme/etiketleme — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { formatQuantity, ingredientLabel, scaleQuantity } from '../ingredients';
import type { Ingredient } from '../../engine/types';

test('scaleQuantity porsiyona göre ölçekler', () => {
  assert.equal(scaleQuantity(4, 2, 4), 8);
  assert.equal(scaleQuantity(3, 2, 1), 1.5);
  assert.equal(scaleQuantity(undefined, 2, 4), undefined);
  assert.equal(scaleQuantity(2, 0, 4), 2); // geçersiz kaynak porsiyon → değişmez
});

test('formatQuantity gereksiz ondalığı atar', () => {
  assert.equal(formatQuantity(2), '2');
  assert.equal(formatQuantity(1.5), '1.5');
  assert.equal(formatQuantity(2.0), '2');
});

const domates: Ingredient = {
  name: { tr: 'domates', en: 'tomato' },
  quantity: 2,
  unit: { tr: 'adet', en: 'pcs' },
};

test('ingredientLabel dile ve porsiyona göre etiket üretir', () => {
  assert.equal(ingredientLabel(domates, 2, 2, 'tr'), '2 adet domates');
  assert.equal(ingredientLabel(domates, 2, 4, 'en'), '4 pcs tomato');
});

test('miktarsız malzemede yalnızca ad', () => {
  const tuz: Ingredient = { name: { tr: 'tuz', en: 'salt' } };
  assert.equal(ingredientLabel(tuz, 2, 4, 'tr'), 'tuz');
});
