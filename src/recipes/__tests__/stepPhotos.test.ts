/** Adım fotoğrafları yardımcıları — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseStepPhotos,
  serializeStepPhotos,
  setStepPhoto,
  removeStepPhoto,
  getStepPhoto,
} from '../stepPhotos';

test('parse geçersiz girdide boş harita', () => {
  assert.deepEqual(parseStepPhotos(null), {});
  assert.deepEqual(parseStepPhotos('{bozuk'), {});
  assert.deepEqual(parseStepPhotos('[1,2]'), {});
});

test('parse bozuk iç değerleri atlar', () => {
  assert.deepEqual(parseStepPhotos('{"menemen":{"n1":"uri://a","n2":5,"n3":""}}'), {
    menemen: { n1: 'uri://a' },
  });
  // tüm iç değerler bozuksa tarif anahtarı düşer
  assert.deepEqual(parseStepPhotos('{"menemen":{"n1":1}}'), {});
});

test('serialize/parse gidiş-dönüş', () => {
  const map = { menemen: { n1: 'uri://a' }, pilav: { s2: 'uri://b' } };
  assert.deepEqual(parseStepPhotos(serializeStepPhotos(map)), map);
});

test('setStepPhoto ekler ve girdiyi değiştirmez', () => {
  const base = {};
  const next = setStepPhoto(base, 'menemen', 'n1', 'uri://a');
  assert.deepEqual(next, { menemen: { n1: 'uri://a' } });
  assert.deepEqual(base, {});
});

test('setStepPhoto aynı tarifin başka adımını korur', () => {
  const base = { menemen: { n1: 'uri://a' } };
  const next = setStepPhoto(base, 'menemen', 'n2', 'uri://b');
  assert.deepEqual(next, { menemen: { n1: 'uri://a', n2: 'uri://b' } });
});

test('removeStepPhoto adımı siler, boşalan tarifi düşürür', () => {
  const base = { menemen: { n1: 'uri://a' } };
  assert.deepEqual(removeStepPhoto(base, 'menemen', 'n1'), {});
});

test('removeStepPhoto olmayanı dokunmadan döner', () => {
  const base = { menemen: { n1: 'uri://a' } };
  assert.equal(removeStepPhoto(base, 'menemen', 'yok'), base);
});

test('getStepPhoto okur', () => {
  const base = { menemen: { n1: 'uri://a' } };
  assert.equal(getStepPhoto(base, 'menemen', 'n1'), 'uri://a');
  assert.equal(getStepPhoto(base, 'menemen', 'n2'), undefined);
  assert.equal(getStepPhoto(base, 'pilav', 'n1'), undefined);
});
