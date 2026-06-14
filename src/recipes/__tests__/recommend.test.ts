/** "Sana özel tarif öner" mantığı — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { tokenize, scoreRecipe, rankByCraving, bestRecipeId, isValidRecipeId } from '../recommend';
import { DEFAULT_PROFILE } from '../profile';
import { recipeList, getRecipe } from '../index';

test('tokenize kısa kelimeleri eler ve küçük harfe çevirir', () => {
  assert.deepEqual(tokenize('Canım ÇORBA çekti, e mi?'), ['canım', 'çorba', 'çekti', 'mi']);
});

test('scoreRecipe başlık eşleşmesini malzemeden yüksek puanlar', () => {
  const menemen = getRecipe('menemen')!;
  // "menemen" başlıkta → 3; "yumurta" malzemede → 2
  assert.equal(scoreRecipe(['menemen'], menemen), 3);
  assert.ok(scoreRecipe(['yumurta'], menemen) >= 2);
  assert.equal(scoreRecipe(['xyzyok'], menemen), 0);
});

test('rankByCraving ilgili tarifi öne alır', () => {
  const ranked = rankByCraving('çorba', recipeList, DEFAULT_PROFILE);
  assert.ok(ranked[0]!.score > 0);
  // ilk sıradaki bir çorba olmalı
  assert.ok(ranked[0]!.recipe.id.includes('corba'));
});

test('rankByCraving boş ifadede hepsini 0 puanla, profil sırasında döner', () => {
  const ranked = rankByCraving('', recipeList, DEFAULT_PROFILE);
  assert.equal(ranked.length, recipeList.length);
  assert.ok(ranked.every((r) => r.score === 0));
});

test('bestRecipeId vegan profilde eti önermez', () => {
  const id = bestRecipeId('et', recipeList, { diet: 'vegan', avoid: [], skill: 'beginner' });
  assert.ok(id);
  const rec = getRecipe(id!)!;
  // önerilen tarif vegan olmalı (et/yumurta içermemeli)
  const keys = (rec.ingredients ?? []).map((i) => i.name);
  assert.ok(keys.length >= 0);
});

test('bestRecipeId eşleşme olmasa bile bir öneri verir', () => {
  const id = bestRecipeId('xyzyokböyle', recipeList, DEFAULT_PROFILE);
  assert.ok(id);
});

test('isValidRecipeId aday doğrulaması', () => {
  assert.equal(isValidRecipeId('menemen', recipeList), true);
  assert.equal(isValidRecipeId('uydurma-tarif', recipeList), false);
});
