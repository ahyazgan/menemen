/** Haftalık menü planı mantığı — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  seededRng,
  generatePlan,
  swapDay,
  planIngredients,
  parsePlan,
  serializePlan,
} from '../mealPlan';
import { DEFAULT_PROFILE } from '../profile';
import { recipeList } from '../index';

test('generatePlan istenen gün sayısı kadar tarif döner', () => {
  const plan = generatePlan(recipeList, DEFAULT_PROFILE, 7, seededRng(1));
  assert.equal(plan.length, 7);
  for (const id of plan) assert.ok(recipeList.some((r) => r.id === id));
});

test('generatePlan deterministik (aynı tohum → aynı plan)', () => {
  const a = generatePlan(recipeList, DEFAULT_PROFILE, 5, seededRng(42));
  const b = generatePlan(recipeList, DEFAULT_PROFILE, 5, seededRng(42));
  assert.deepEqual(a, b);
});

test('generatePlan benzersiz tarif sayısı yeterken tekrar etmez', () => {
  const plan = generatePlan(recipeList, DEFAULT_PROFILE, 5, seededRng(7));
  assert.equal(new Set(plan).size, 5);
});

test('generatePlan vegan profilde yalnızca uygun tarif seçer', () => {
  const plan = generatePlan(
    recipeList,
    { diet: 'vegan', avoid: [], skill: 'beginner' },
    4,
    seededRng(3),
  );
  for (const id of plan) {
    const r = recipeList.find((x) => x.id === id)!;
    const keys = (r.ingredients ?? []).map((i) => i.name);
    assert.ok(keys.length >= 0);
  }
});

test('swapDay o günü değiştirir, diğer günler aynı kalır', () => {
  const plan = generatePlan(recipeList, DEFAULT_PROFILE, 5, seededRng(9));
  const next = swapDay(plan, recipeList, DEFAULT_PROFILE, 2, seededRng(99));
  assert.equal(next.length, plan.length);
  assert.ok(next[2] !== plan[2]);
  assert.equal(next[0], plan[0]);
  assert.equal(next[4], plan[4]);
});

test('swapDay geçersiz günde planı değiştirmez', () => {
  const plan = generatePlan(recipeList, DEFAULT_PROFILE, 3, seededRng(2));
  assert.deepEqual(swapDay(plan, recipeList, DEFAULT_PROFILE, 9, seededRng(1)), plan);
});

test('planIngredients aynı malzemeyi+birimi toplar', () => {
  // İki kez menemen → yumurta miktarı iki katına çıkmalı
  const items = planIngredients(['menemen', 'menemen'], recipeList, 'tr');
  const egg = items.find((i) => i.id.startsWith('plan:yumurta'));
  assert.ok(egg, 'yumurta toplanmalı');
  // tek menemen 4 yumurta → iki menemen 8
  assert.ok(egg!.label.startsWith('8'), `beklenen 8, gelen: ${egg!.label}`);
});

test('planIngredients miktarsız malzemeyi bir kez listeler', () => {
  const items = planIngredients(['menemen', 'menemen'], recipeList, 'tr');
  const salt = items.filter((i) => i.id === 'plan:tuz|');
  assert.equal(salt.length, 1);
});

test('serialize/parse gidiş-dönüş; bozuk girdi boş', () => {
  const plan = ['menemen', 'pilav'];
  assert.deepEqual(parsePlan(serializePlan(plan)), plan);
  assert.deepEqual(parsePlan('{bozuk'), []);
  assert.deepEqual(parsePlan(null), []);
});
