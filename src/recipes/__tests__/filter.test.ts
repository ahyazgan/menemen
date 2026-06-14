/** filterRecipes() testleri — arama + kategori (saf). */
import test from 'node:test';
import assert from 'node:assert/strict';

import { CATEGORIES, filterRecipes } from '../filter';
import { recipeList } from '../index';

test('her tarifin geçerli bir kategorisi var', () => {
  for (const recipe of recipeList) {
    assert.ok(
      recipe.category && CATEGORIES.includes(recipe.category),
      `${recipe.id}: geçersiz/eksik kategori`,
    );
  }
});

test('filtre yoksa tüm tarifler döner', () => {
  assert.equal(filterRecipes(recipeList).length, recipeList.length);
});

test('kategori süzgeci yalnızca o kategoriyi döndürür', () => {
  const soups = filterRecipes(recipeList, { category: 'corba' });
  assert.ok(soups.length >= 2);
  assert.ok(soups.every((r) => r.category === 'corba'));
});

test('arama TR metninde eşleşir', () => {
  const found = filterRecipes(recipeList, { query: 'menemen' });
  assert.ok(found.some((r) => r.id === 'menemen'));
});

test('arama EN metninde eşleşir', () => {
  const soups = filterRecipes(recipeList, { query: 'soup' });
  assert.ok(soups.length >= 2);
  assert.ok(soups.some((r) => r.id === 'mercimek-corbasi'));
});

test('arama + kategori birlikte çalışır', () => {
  const found = filterRecipes(recipeList, { query: 'tavuk', category: 'ana-yemek' });
  assert.ok(found.every((r) => r.category === 'ana-yemek'));
  assert.ok(found.some((r) => r.id === 'tavuk-sote' || r.id === 'firin-tavuk'));
});

test('eşleşme yoksa boş döner', () => {
  assert.equal(filterRecipes(recipeList, { query: 'zzzznotexist' }).length, 0);
});
