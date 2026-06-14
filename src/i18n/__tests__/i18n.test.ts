/**
 * i18n testleri — TR/EN anahtar paritesi, dil değişimi ve eksik anahtar geri
 * dönüşü. Saf modül; servis/UI gerekmez.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { AVAILABLE_LOCALES, getLocale, pickSupportedLocale, setLocale, t } from '../index';
import { tr } from '../tr';
import { en } from '../en';

function flatKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const out: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object') {
      out.push(...flatKeys(value as Record<string, unknown>, path));
    } else {
      out.push(path);
    }
  }
  return out.sort();
}

test('TR ve EN anahtarları birebir aynı', () => {
  assert.deepEqual(flatKeys(en as Record<string, unknown>), flatKeys(tr as Record<string, unknown>));
});

test('varsayılan dil tr', () => {
  setLocale('tr');
  assert.equal(getLocale(), 'tr');
  assert.equal(t('cooking.listen'), 'Bas konuş');
});

test('setLocale("en") çeviriyi değiştirir', () => {
  setLocale('en');
  assert.equal(t('cooking.listen'), 'Hold to talk');
  setLocale('tr');
});

test('bilinmeyen anahtar kendini döndürür', () => {
  assert.equal(t('yok.boyle.bir.anahtar'), 'yok.boyle.bir.anahtar');
});

test('bilinmeyen dil aktif dili değiştirmez', () => {
  setLocale('tr');
  setLocale('xx');
  assert.equal(getLocale(), 'tr');
});

test('en desteklenen diller arasında', () => {
  assert.ok(AVAILABLE_LOCALES.includes('en'));
});

test('pickSupportedLocale: cihaz dilini eşler (bölge eki yok sayılır)', () => {
  assert.equal(pickSupportedLocale(['en-US'], ['tr', 'en'], 'tr'), 'en');
  assert.equal(pickSupportedLocale(['TR-tr'], ['tr', 'en'], 'tr'), 'tr');
});

test('pickSupportedLocale: ilk eşleşeni seçer, desteklenmeyeni atlar', () => {
  assert.equal(pickSupportedLocale(['fr', 'en'], ['tr', 'en'], 'tr'), 'en');
});

test('pickSupportedLocale: eşleşme yoksa fallback', () => {
  assert.equal(pickSupportedLocale(['fr', 'de'], ['tr', 'en'], 'tr'), 'tr');
  assert.equal(pickSupportedLocale([], ['tr', 'en'], 'tr'), 'tr');
});
