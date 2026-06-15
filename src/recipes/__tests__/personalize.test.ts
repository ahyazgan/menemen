/** Cihaz-içi kişiselleştirme — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { buildAffinity, forYou, personalizedScore } from '../personalize';
import type { HistoryEntry } from '../history';
import type { Recipe } from '../../engine/types';

function recipe(id: string, category: Recipe['category'], ings: string[]): Recipe {
  return {
    id,
    title: id,
    servings: 2,
    locale: 'tr',
    category,
    ingredients: ings.map((n) => ({ name: n })),
    nodes: [
      { id: 'n', title: 't', instruction: 'i', kind: 'prep', requires: [], completion: 'user' },
    ],
  };
}

const catalog: Recipe[] = [
  recipe('a', 'corba', ['mercimek', 'soğan']),
  recipe('b', 'corba', ['mercimek', 'havuç']),
  recipe('c', 'salata', ['domates', 'salatalık']),
  recipe('d', 'ana-yemek', ['tavuk', 'soğan']),
];

const history: HistoryEntry[] = [{ recipeId: 'a', at: 1, count: 3 }];

test('buildAffinity geçmişten kategori/malzeme ağırlığı çıkarır', () => {
  const aff = buildAffinity(history, catalog);
  assert.equal(aff.categories['corba'], 3);
  assert.equal(aff.ingredients['mercimek'], 3);
  assert.equal(aff.ingredients['soğan'], 3);
  assert.equal(aff.categories['salata'] ?? 0, 0);
});

test('personalizedScore benzer tarifi yükseltir', () => {
  const aff = buildAffinity(history, catalog);
  // b: aynı kategori (corba) + mercimek paylaşıyor → c'den (salata) yüksek olmalı.
  assert.ok(personalizedScore(catalog[1]!, aff) > personalizedScore(catalog[2]!, aff));
});

test('forYou pişirilmemiş, zevke uygun tarifleri döndürür', () => {
  const out = forYou(catalog, history);
  const ids = out.map((r) => r.id);
  assert.ok(!ids.includes('a')); // zaten pişirildi → hariç
  assert.equal(ids[0], 'b'); // en uygun (aynı kategori + ortak malzeme)
});

test('geçmiş yoksa boş döner (yeni kullanıcı)', () => {
  assert.deepEqual(forYou(catalog, []), []);
});

test('limit uygulanır', () => {
  const big: HistoryEntry[] = [{ recipeId: 'a', at: 1, count: 1 }];
  assert.ok(forYou(catalog, big, { limit: 1 }).length <= 1);
});
