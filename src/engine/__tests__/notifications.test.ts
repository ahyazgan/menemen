/** Zamanlayıcı bildirimi yardımcıları — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { buildTimerNotification, isTimerNode, timerNotificationId } from '../notifications';
import type { RecipeNode } from '../types';

function node(extra: Partial<RecipeNode>): RecipeNode {
  return {
    id: 'n',
    title: { tr: 'Pişir', en: 'Cook' },
    instruction: '',
    kind: 'action',
    requires: [],
    completion: 'user',
    ...extra,
  };
}

test('yalnızca pozitif süreli timer düğümleri bildirim alır', () => {
  assert.equal(isTimerNode(node({ completion: 'timer', durationSec: 60 })), true);
  assert.equal(isTimerNode(node({ completion: 'timer' })), false); // süre yok
  assert.equal(isTimerNode(node({ completion: 'timer', durationSec: 0 })), false);
  assert.equal(isTimerNode(node({ completion: 'user', durationSec: 60 })), false);
});

test('bildirim kimliği kararlı', () => {
  assert.equal(timerNotificationId('simmer'), 'timer:simmer');
});

test('buildTimerNotification başlığı localize eder, body enjekte edilir', () => {
  const n = node({
    id: 'simmer',
    completion: 'timer',
    durationSec: 90,
    title: { tr: 'Pişir', en: 'Simmer' },
  });
  const en = buildTimerNotification(n, 'en', 'Time is up');
  assert.equal(en.id, 'timer:simmer');
  assert.equal(en.title, 'Simmer');
  assert.equal(en.body, 'Time is up');
  assert.equal(en.inSeconds, 90);
});

test('inSeconds en az 1 ve kalan süreye göre', () => {
  const n = node({ completion: 'timer', durationSec: 90 });
  assert.equal(buildTimerNotification(n, 'tr', 'b', 0).inSeconds, 1);
  assert.equal(buildTimerNotification(n, 'tr', 'b', 12.4).inSeconds, 13);
});
