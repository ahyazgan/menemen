/** Paylaşım metni — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { recipeDeepLink, buildShareText } from '../share';

test('recipeDeepLink scheme + id', () => {
  assert.equal(recipeDeepLink('menemen'), 'lezzet://recipe/menemen');
});

test('buildShareText tüm yer tutucuları doldurur', () => {
  const out = buildShareText('"{title}" yaptım, dene: {link}', 'Menemen', 'lezzet://recipe/menemen');
  assert.equal(out, '"Menemen" yaptım, dene: lezzet://recipe/menemen');
});

test('buildShareText birden çok yer tutucuyu değiştirir', () => {
  assert.equal(buildShareText('{title} {title}', 'X', 'L'), 'X X');
  assert.equal(buildShareText('{link}-{link}', 'X', 'L'), 'L-L');
});
