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
