/** Beceri etkisi — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { skillFitScore, guidance } from '../skill';
import { recipeDifficulty } from '../profile';
import { recipeList } from '../index';

test('orta seviye nötr (hepsi 0)', () => {
  for (const r of recipeList) assert.equal(skillFitScore(r, 'intermediate'), 0);
});

test('yeni başlayan kolayı, ileri zoru yeğler', () => {
  const easy = recipeList.find((r) => recipeDifficulty(r) === 'easy');
  const hard = recipeList.find((r) => recipeDifficulty(r) === 'hard');
  if (easy) {
    assert.equal(skillFitScore(easy, 'beginner'), 0);
    assert.equal(skillFitScore(easy, 'advanced'), 2);
  }
  if (hard) {
    assert.equal(skillFitScore(hard, 'beginner'), 2);
    assert.equal(skillFitScore(hard, 'advanced'), 0);
  }
});

test('guidance beceriye göre bayraklar', () => {
  assert.deepEqual(guidance('beginner'), { stepNumbers: true, verbose: true });
  assert.deepEqual(guidance('intermediate'), { stepNumbers: true, verbose: false });
  assert.deepEqual(guidance('advanced'), { stepNumbers: false, verbose: false });
});
