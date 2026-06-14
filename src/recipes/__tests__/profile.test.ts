/** Kişisel profil mantığı — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_PROFILE,
  recipeDiet,
  recipeMatchesDiet,
  recipeAvoidConflicts,
  recipeMatchesProfile,
  filterByProfile,
  recipeDifficulty,
  parseProfile,
  serializeProfile,
  toggleAvoid,
} from '../profile';
import { recipeList, getRecipe } from '../index';

test('recipeDiet eti olan tarifi vejetaryen saymaz', () => {
  const tavuk = getRecipe('tavuk-sote') ?? getRecipe('firin-tavuk');
  assert.ok(tavuk, 'tavuk tarifi bulunmalı');
  const d = recipeDiet(tavuk!);
  assert.equal(d.vegetarian, false);
  assert.equal(d.vegan, false);
});

test('recipeDiet yumurtalı tarifi vejetaryen sayar, vegan saymaz', () => {
  const menemen = getRecipe('menemen')!;
  const d = recipeDiet(menemen);
  assert.equal(d.vegetarian, true);
  assert.equal(d.vegan, false);
});

test('recipeDiet tamamen bitkisel tarifi vegan sayar', () => {
  const salata = getRecipe('coban-salatasi');
  assert.ok(salata, 'çoban salatası bulunmalı');
  const d = recipeDiet(salata!);
  assert.equal(d.vegan, true);
});

test('recipeMatchesDiet all her zaman true', () => {
  for (const r of recipeList) assert.equal(recipeMatchesDiet(r, 'all'), true);
});

test('recipeAvoidConflicts kaçınılan malzemeyi yakalar', () => {
  const menemen = getRecipe('menemen')!;
  assert.deepEqual(recipeAvoidConflicts(menemen, new Set(['yumurta'])), ['yumurta']);
  assert.deepEqual(recipeAvoidConflicts(menemen, new Set()), []);
});

test('recipeMatchesProfile diyet + kaçınma birlikte', () => {
  const menemen = getRecipe('menemen')!;
  const m = recipeMatchesProfile(menemen, { diet: 'vegan', avoid: [], skill: 'beginner' });
  assert.equal(m.dietOk, false);
  assert.equal(m.ok, false);
  const m2 = recipeMatchesProfile(menemen, { diet: 'all', avoid: ['yumurta'], skill: 'beginner' });
  assert.equal(m2.dietOk, true);
  assert.deepEqual(m2.conflicts, ['yumurta']);
  assert.equal(m2.ok, false);
});

test('filterByProfile vegan diyette eti/yumurtayı düşürür', () => {
  const vegan = filterByProfile(recipeList, { diet: 'vegan', avoid: [], skill: 'beginner' });
  for (const r of vegan) assert.equal(recipeDiet(r).vegan, true);
  // varsayılan profil hiçbir şeyi düşürmez
  assert.equal(filterByProfile(recipeList, DEFAULT_PROFILE).length, recipeList.length);
});

test('recipeDifficulty adım sayısına göre', () => {
  for (const r of recipeList) {
    const d = recipeDifficulty(r);
    assert.ok(d === 'easy' || d === 'medium' || d === 'hard');
  }
});

test('parseProfile bozuk/eksik girdide varsayılan', () => {
  assert.deepEqual(parseProfile(null), DEFAULT_PROFILE);
  assert.deepEqual(parseProfile('{bozuk'), DEFAULT_PROFILE);
  assert.deepEqual(parseProfile('{"diet":"yok","skill":"x","avoid":[1,"yumurta"]}'), {
    diet: 'all',
    skill: 'intermediate',
    avoid: ['yumurta'],
  });
});

test('serialize/parse gidiş-dönüş', () => {
  const p = { diet: 'vegetarian' as const, avoid: ['balık'], skill: 'advanced' as const };
  assert.deepEqual(parseProfile(serializeProfile(p)), p);
});

test('toggleAvoid ekler ve çıkarır', () => {
  const p = DEFAULT_PROFILE;
  const added = toggleAvoid(p, 'yumurta');
  assert.deepEqual(added.avoid, ['yumurta']);
  assert.deepEqual(toggleAvoid(added, 'yumurta').avoid, []);
  assert.deepEqual(p.avoid, []); // girdi değişmez
});
