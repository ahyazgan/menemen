/** localize() birim testleri — çok dilli metin çözümü (saf). */
import test from 'node:test';
import assert from 'node:assert/strict';

import { localize } from '../localize';

test('düz string her dilde aynı döner', () => {
  assert.equal(localize('merhaba', 'en'), 'merhaba');
  assert.equal(localize('merhaba', 'tr'), 'merhaba');
});

test("çok dilli metin locale'e göre çözülür", () => {
  const text = { tr: 'Merhaba', en: 'Hello' };
  assert.equal(localize(text, 'en'), 'Hello');
  assert.equal(localize(text, 'tr'), 'Merhaba');
});

test('locale yoksa fallback (tr), o da yoksa ilk değer', () => {
  assert.equal(localize({ tr: 'TR', en: 'EN' }, 'de'), 'TR');
  assert.equal(localize({ en: 'EN', de: 'DE' }, 'fr'), 'EN');
});

test('undefined boş string döner', () => {
  assert.equal(localize(undefined, 'tr'), '');
});
