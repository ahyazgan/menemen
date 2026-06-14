/** Pişirme geçmişi yardımcıları — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  cookCounts,
  parseHistory,
  recordHistory,
  serializeHistory,
  type HistoryEntry,
} from '../history';

test('parse geçersiz girdide boş liste; eksik count 1 sayılır', () => {
  assert.deepEqual(parseHistory(null), []);
  assert.deepEqual(parseHistory('{bozuk'), []);
  assert.deepEqual(parseHistory('[{"recipeId":1}]'), []);
  assert.deepEqual(parseHistory('[{"recipeId":"a","at":5}]'), [{ recipeId: 'a', at: 5, count: 1 }]);
});

test('serialize/parse gidiş-dönüş', () => {
  const entries: HistoryEntry[] = [{ recipeId: 'menemen', at: 5, count: 2 }];
  assert.deepEqual(parseHistory(serializeHistory(entries)), entries);
});

test('record en başa ekler, sayaç 1 başlar', () => {
  const out = recordHistory([], 'b', 2);
  assert.deepEqual(out, [{ recipeId: 'b', at: 2, count: 1 }]);
});

test('aynı tarif tekrar pişince başa taşınır ve sayaç artar', () => {
  let list: HistoryEntry[] = recordHistory([], 'a', 1);
  list = recordHistory(list, 'b', 2);
  list = recordHistory(list, 'a', 3);
  assert.deepEqual(
    list.map((e) => e.recipeId),
    ['a', 'b'],
  );
  assert.equal(list[0]?.count, 2);
  assert.equal(list[0]?.at, 3);
});

test('max ile sınırlanır', () => {
  let list: HistoryEntry[] = [];
  for (let i = 0; i < 5; i++) list = recordHistory(list, `r${i}`, i, 3);
  assert.equal(list.length, 3);
});

test('cookCounts recipeId → sayı eşlemesi', () => {
  const list: HistoryEntry[] = [
    { recipeId: 'a', at: 2, count: 3 },
    { recipeId: 'b', at: 1, count: 1 },
  ];
  assert.deepEqual(cookCounts(list), { a: 3, b: 1 });
});
