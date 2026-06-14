/** Favori yardımcıları — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { parseFavorites, serializeFavorites, toggleFavorite } from '../favorites';

test('parseFavorites geçersiz/boş girdide boş liste döner', () => {
  assert.deepEqual(parseFavorites(null), []);
  assert.deepEqual(parseFavorites(''), []);
  assert.deepEqual(parseFavorites('{bozuk'), []);
  assert.deepEqual(parseFavorites('123'), []);
  assert.deepEqual(parseFavorites('[1,"a",true]'), ['a']);
});

test('serialize/parse gidiş-dönüş', () => {
  const ids = ['menemen', 'pilav'];
  assert.deepEqual(parseFavorites(serializeFavorites(ids)), ids);
});

test('toggleFavorite ekler ve çıkarır (saf)', () => {
  assert.deepEqual(toggleFavorite([], 'a'), ['a']);
  assert.deepEqual(toggleFavorite(['a'], 'b'), ['a', 'b']);
  assert.deepEqual(toggleFavorite(['a', 'b'], 'a'), ['b']);
});
