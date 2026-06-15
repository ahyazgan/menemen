/** Aktif pişirme oturumu yardımcıları — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { isResumable, parseSession, serializeSession, type CookSession } from '../session';

test('parse geçersiz girdide null döner', () => {
  assert.equal(parseSession(null), null);
  assert.equal(parseSession('{bozuk'), null);
  assert.equal(parseSession('[]'), null);
  assert.equal(parseSession('{"recipeId":5,"at":1}'), null);
  assert.equal(parseSession('{"recipeId":"a"}'), null);
});

test('serialize/parse gidiş-dönüş', () => {
  const s: CookSession = { recipeId: 'menemen', doneIds: ['chop', 'cook'], at: 42 };
  assert.deepEqual(parseSession(serializeSession(s)), s);
});

test('parse doneIds eksikse boş liste yapar, string olmayanı eler', () => {
  assert.deepEqual(parseSession('{"recipeId":"a","at":1}'), {
    recipeId: 'a',
    doneIds: [],
    at: 1,
  });
  assert.deepEqual(parseSession('{"recipeId":"a","at":1,"doneIds":["x",2,"y"]}'), {
    recipeId: 'a',
    doneIds: ['x', 'y'],
    at: 1,
  });
});

test('isResumable yalnızca tamamlanmış adım varsa true', () => {
  assert.equal(isResumable(null), false);
  assert.equal(isResumable({ recipeId: 'a', doneIds: [], at: 1 }), false);
  assert.equal(isResumable({ recipeId: 'a', doneIds: ['chop'], at: 1 }), true);
});
