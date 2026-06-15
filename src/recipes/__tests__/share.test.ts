/** Paylaşım metni — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  recipeDeepLink,
  buildShareText,
  parseRecipeLink,
  buildReferralLink,
  parseReferral,
  genReferralCode,
} from '../share';

test('recipeDeepLink scheme + id', () => {
  assert.equal(recipeDeepLink('menemen'), 'lezzet://recipe/menemen');
});

test('buildShareText tüm yer tutucuları doldurur', () => {
  const out = buildShareText(
    '"{title}" yaptım, dene: {link}',
    'Menemen',
    'lezzet://recipe/menemen',
  );
  assert.equal(out, '"Menemen" yaptım, dene: lezzet://recipe/menemen');
});

test('buildShareText birden çok yer tutucuyu değiştirir', () => {
  assert.equal(buildShareText('{title} {title}', 'X', 'L'), 'X X');
  assert.equal(buildShareText('{link}-{link}', 'X', 'L'), 'L-L');
});

test('parseRecipeLink derin bağlantıdan id çıkarır', () => {
  assert.equal(parseRecipeLink('lezzet://recipe/menemen'), 'menemen');
  assert.equal(parseRecipeLink('lezzet:///recipe/pilav'), 'pilav');
  assert.equal(parseRecipeLink('lezzet://recipe/coban-salatasi?ref=share'), 'coban-salatasi');
});

test('parseRecipeLink gidiş-dönüş (recipeDeepLink ile)', () => {
  assert.equal(parseRecipeLink(recipeDeepLink('kofte')), 'kofte');
});

test('parseRecipeLink eşleşmeyende null', () => {
  assert.equal(parseRecipeLink(null), null);
  assert.equal(parseRecipeLink('https://example.com'), null);
  assert.equal(parseRecipeLink('lezzet://other/x'), null);
});

test('buildReferralLink tarif id + kodu taşır, tarif id hâlâ ayrıştırılır', () => {
  const link = buildReferralLink('menemen', 'abc123');
  assert.equal(link, 'lezzet://recipe/menemen?ref=abc123');
  assert.equal(parseRecipeLink(link), 'menemen');
  assert.equal(parseReferral(link), 'abc123');
});

test('parseReferral kod yoksa null', () => {
  assert.equal(parseReferral('lezzet://recipe/menemen'), null);
  assert.equal(parseReferral(null), null);
});

test('genReferralCode 8 karakter, deterministik (rand enjekte)', () => {
  const a = genReferralCode(() => 0.42);
  const b = genReferralCode(() => 0.42);
  assert.equal(a.length, 8);
  assert.equal(a, b);
});
