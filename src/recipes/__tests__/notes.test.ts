/** Tarif notları yardımcıları — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { parseNotes, serializeNotes, setNote } from '../notes';

test('parse geçersiz girdide boş harita', () => {
  assert.deepEqual(parseNotes(null), {});
  assert.deepEqual(parseNotes('{bozuk'), {});
  assert.deepEqual(parseNotes('[1,2]'), {});
  assert.deepEqual(parseNotes('{"a":1,"b":"x"}'), { b: 'x' });
});

test('serialize/parse gidiş-dönüş', () => {
  const notes = { menemen: 'az tuz' };
  assert.deepEqual(parseNotes(serializeNotes(notes)), notes);
});

test('setNote ekler', () => {
  assert.deepEqual(setNote({}, 'a', 'not'), { a: 'not' });
});

test('setNote boş metinde kaydı kaldırır', () => {
  assert.deepEqual(setNote({ a: 'not' }, 'a', '   '), {});
});
