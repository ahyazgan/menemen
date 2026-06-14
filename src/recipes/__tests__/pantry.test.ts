/** "Elimde ne var?" mantığı — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { allIngredients, rankByPantry, recipeIngredientKeys } from '../pantry';
import { recipeList, getRecipe } from '../index';

test('recipeIngredientKeys TR adlarını küçük harf anahtara çevirir', () => {
  const menemen = getRecipe('menemen')!;
  const keys = recipeIngredientKeys(menemen);
  assert.ok(keys.includes('yumurta'));
  assert.ok(keys.includes('domates'));
});

test('allIngredients benzersiz ve sıralı', () => {
  const all = allIngredients(recipeList);
  const keys = all.map((i) => i.key);
  assert.equal(new Set(keys).size, keys.length); // benzersiz
  const sorted = [...keys].sort((a, b) => a.localeCompare(b, 'tr'));
  assert.deepEqual(keys, sorted);
  assert.ok(keys.includes('yumurta'));
});

test('rankByPantry eksiği en az olanı öne alır', () => {
  const owned = new Set(['yumurta', 'tereyağı', 'tuz', 'karabiber']);
  const ranked = rankByPantry(recipeList, owned);
  // sahanda yumurta bu 4 malzemeyle tamamlanır → en başta olmalı
  assert.equal(ranked[0]?.recipe.id, 'sahanda-yumurta');
  assert.equal(ranked[0]?.have, ranked[0]?.total);
  // menemen de listede ama eksiği var
  const menemen = ranked.find((m) => m.recipe.id === 'menemen');
  assert.ok(menemen && menemen.have > 0 && menemen.have < menemen.total);
});

test('hiç eşleşme yoksa boş', () => {
  assert.equal(rankByPantry(recipeList, new Set(['yokböylemalzeme'])).length, 0);
});
