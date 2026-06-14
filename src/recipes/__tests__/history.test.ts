/** Pişirme geçmişi yardımcıları — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { parseHistory, recordHistory, serializeHistory, type HistoryEntry } from '../history';

test('parse geçersiz girdide boş liste', () => {
  assert.deepEqual(parseHistory(null), []);
  assert.deepEqual(parseHistory('{bozuk'), []);
  assert.deepEqual(parseHistory('[{"recipeId":1}]'), []);
});

test('serialize/parse gidiş-dönüş', () => {
  const entries = [{ recipeId: 'menemen', at: 5 }];
  assert.deepEqual(parseHistory(serializeHistory(entries)), entries);
});

test('record en başa ekler', () => {
  const out = recordHistory([{ recipeId: 'a', at: 1 }], 'b', 2);
  assert.deepEqual(
    out.map((e) => e.recipeId),
    ['b', 'a'],
  );
});

test('aynı tarif tekrar pişince başa taşınır (yinelenme yok)', () => {
  const out = recordHistory([{ recipeId: 'a', at: 1 }, { recipeId: 'b', at: 2 }], 'a', 3);
  assert.deepEqual(
    out.map((e) => e.recipeId),
    ['a', 'b'],
  );
  assert.equal(out[0]?.at, 3);
});

test('max ile sınırlanır', () => {
  let list: HistoryEntry[] = [];
  for (let i = 0; i < 5; i++) list = recordHistory(list, `r${i}`, i, 3);
  assert.equal(list.length, 3);
  assert.deepEqual(
    list.map((e) => e.recipeId),
    ['r4', 'r3', 'r2'],
  );
});
