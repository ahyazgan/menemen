/** Alışveriş listesi yardımcıları — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  addShoppingItems,
  clearChecked,
  parseShoppingItems,
  removeShoppingItem,
  serializeShoppingItems,
  toggleShoppingChecked,
  type ShoppingItem,
} from '../shopping';

const item = (id: string, checked = false): ShoppingItem => ({ id, label: id, checked });

test('parse geçersiz girdide boş liste', () => {
  assert.deepEqual(parseShoppingItems(null), []);
  assert.deepEqual(parseShoppingItems('{bozuk'), []);
  assert.deepEqual(parseShoppingItems('[{"x":1}]'), []);
});

test('serialize/parse gidiş-dönüş', () => {
  const items = [item('a'), item('b', true)];
  assert.deepEqual(parseShoppingItems(serializeShoppingItems(items)), items);
});

test('addShoppingItems yineleneni atlar', () => {
  const cur = [item('a')];
  const next = addShoppingItems(cur, [item('a'), item('b')]);
  assert.deepEqual(
    next.map((i) => i.id),
    ['a', 'b'],
  );
});

test('toggle ve remove', () => {
  const items = [item('a'), item('b')];
  assert.equal(toggleShoppingChecked(items, 'a')[0]?.checked, true);
  assert.deepEqual(
    removeShoppingItem(items, 'a').map((i) => i.id),
    ['b'],
  );
});

test('clearChecked işaretlenenleri çıkarır', () => {
  const items = [item('a', true), item('b')];
  assert.deepEqual(
    clearChecked(items).map((i) => i.id),
    ['b'],
  );
});
