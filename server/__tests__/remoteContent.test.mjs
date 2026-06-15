import test from 'node:test';
import assert from 'node:assert/strict';

import { loadFlags, loadRecipes } from '../remoteContent.mjs';

test('loadFlags: ayarlı geçerli JSON nesnesini döner', () => {
  assert.deepEqual(loadFlags({ LEZZET_FLAGS: '{"liveVoice":true}' }), { liveVoice: true });
});

test('loadFlags: eksik/bozuk/dizi girdide boş nesne', () => {
  assert.deepEqual(loadFlags({}), {});
  assert.deepEqual(loadFlags({ LEZZET_FLAGS: '{bozuk' }), {});
  assert.deepEqual(loadFlags({ LEZZET_FLAGS: '[1,2]' }), {});
});

test('loadRecipes: dosyadan dizi okur (readFn enjekte)', () => {
  const out = loadRecipes('/x/recipes.json', () => '[{"id":"a"}]');
  assert.deepEqual(out, [{ id: 'a' }]);
});

test('loadRecipes: yol yoksa boş dizi', () => {
  assert.deepEqual(
    loadRecipes(undefined, () => '[1]'),
    [],
  );
});

test('loadRecipes: bozuk JSON ya da dizi-değilse boş dizi', () => {
  assert.deepEqual(
    loadRecipes('/x', () => '{bozuk'),
    [],
  );
  assert.deepEqual(
    loadRecipes('/x', () => '{"id":"a"}'),
    [],
  );
});

test('loadRecipes: okuma hatasını yutar', () => {
  assert.deepEqual(
    loadRecipes('/x', () => {
      throw new Error('ENOENT');
    }),
    [],
  );
});
