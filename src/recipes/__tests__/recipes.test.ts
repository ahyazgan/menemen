/**
 * Tarif kütüphanesi testleri — her graf geçerli (DAG), başlatılabilir ve
 * tamamlanabilir olmalı. Saf motorla doğrulanır (servis/UI gerekmez).
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { RecipeEngine } from '../../engine/RecipeEngine';
import { recipeList } from '../index';

test('tüm tarifler geçerli DAG ve kurulabilir', () => {
  for (const recipe of recipeList) {
    assert.doesNotThrow(() => new RecipeEngine(recipe), `${recipe.id} kurulamadı`);
  }
});

test('her tarifte başlangıçta en az bir hazır düğüm var', () => {
  for (const recipe of recipeList) {
    const snapshot = new RecipeEngine(recipe).snapshot();
    assert.ok(snapshot.ready.length > 0, `${recipe.id}: başlangıçta hazır düğüm yok`);
  }
});

function asMap(value: unknown): Record<string, string> {
  assert.equal(typeof value, 'object', 'çift dilli (nesne) bekleniyordu');
  return value as Record<string, string>;
}

function assertBilingual(value: unknown, where: string): void {
  const map = asMap(value);
  assert.ok(map.tr && map.en, `${where}: tr/en eksik`);
}

/** Adım metinleri tamamen TR+EN çevrilmiş tarifler. Çevirdikçe genişler. */
const FULLY_BILINGUAL = new Set([
  'menemen',
  'sahanda-yumurta',
  'coban-salatasi',
  'haslanmis-yumurta',
  'sigara-boregi',
]);

test('her tarifin başlığı ve özeti çift dilli (tr + en)', () => {
  for (const recipe of recipeList) {
    assertBilingual(recipe.title, `${recipe.id}.title`);
    if (recipe.summary !== undefined) assertBilingual(recipe.summary, `${recipe.id}.summary`);
  }
});

test('tam çevrilmiş tarifler her metin alanında tr+en taşır', () => {
  for (const recipe of recipeList) {
    if (!FULLY_BILINGUAL.has(recipe.id)) continue;
    for (const node of recipe.nodes) {
      assertBilingual(node.title, `${recipe.id}/${node.id}.title`);
      assertBilingual(node.instruction, `${recipe.id}/${node.id}.instruction`);
      if (node.voice_on_enter !== undefined) {
        assertBilingual(node.voice_on_enter, `${recipe.id}/${node.id}.voice_on_enter`);
      }
      if (node.voice_on_complete !== undefined) {
        assertBilingual(node.voice_on_complete, `${recipe.id}/${node.id}.voice_on_complete`);
      }
      if (node.safety) assertBilingual(node.safety.message, `${recipe.id}/${node.id}.safety`);
      for (const [key, value] of Object.entries(node.recovery_rules ?? {})) {
        assertBilingual(value, `${recipe.id}/${node.id}.recovery.${key}`);
      }
    }
  }
});

test('kritik güvenlik adımları iç sıcaklık eşiği taşır (gıda güvenliği)', () => {
  for (const recipe of recipeList) {
    for (const node of recipe.nodes) {
      if (node.safety?.critical) {
        assert.ok(
          node.safety.minInternalTempC,
          `${recipe.id}/${node.id}: kritik adımda iç sıcaklık eşiği yok`,
        );
      }
    }
  }
});

test('her tarif baştan sona tamamlanabilir', () => {
  for (const recipe of recipeList) {
    const engine = new RecipeEngine(recipe);
    let guard = 0;
    while (!engine.snapshot().complete && guard < 200) {
      const ready = engine.snapshot().ready;
      if (ready.length === 0) break;
      for (const id of ready) engine.complete(id);
      guard += 1;
    }
    assert.equal(engine.snapshot().complete, true, `${recipe.id} tamamlanamadı`);
  }
});
