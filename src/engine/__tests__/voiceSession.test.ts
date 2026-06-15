/** Canlı ses oturumu durum makinesi — saf testler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  canBargeIn,
  initialVoiceSession,
  reduceVoiceSession,
  type VoiceSessionState,
} from '../voiceSession';

function run(events: Parameters<typeof reduceVoiceSession>[1][]): VoiceSessionState {
  return events.reduce(reduceVoiceSession, initialVoiceSession);
}

test('connect → connected canlıya geçirir', () => {
  const s = run([{ type: 'connect' }, { type: 'connected' }]);
  assert.equal(s.conn, 'live');
});

test('connecting sırasında tekrar connect yok sayılır', () => {
  const s = run([{ type: 'connect' }, { type: 'connect' }]);
  assert.equal(s.conn, 'connecting');
});

test('canlıyken düşüş reconnecting, sonra reconnected canlıya döner', () => {
  const s = run([{ type: 'connect' }, { type: 'connected' }, { type: 'dropped' }]);
  assert.equal(s.conn, 'reconnecting');
  assert.equal(s.agentSpeaking, false);
  const back = reduceVoiceSession(s, { type: 'reconnected' });
  assert.equal(back.conn, 'live');
});

test('failed hata durumuna geçer ve mesajı tutar', () => {
  const s = run([{ type: 'connect' }, { type: 'failed', error: 'token reddedildi' }]);
  assert.equal(s.conn, 'error');
  assert.equal(s.error, 'token reddedildi');
});

test('disconnect oturumu bitirir ve durumu sıfırlar', () => {
  const s = run([{ type: 'connect' }, { type: 'connected' }, { type: 'disconnect' }]);
  assert.equal(s.conn, 'ended');
  assert.equal(s.agentSpeaking, false);
});

test('hata/bitti durumundan connect ile yeniden bağlanılabilir', () => {
  const ended = run([{ type: 'connect' }, { type: 'connected' }, { type: 'disconnect' }]);
  const again = reduceVoiceSession(ended, { type: 'connect' });
  assert.equal(again.conn, 'connecting');
});

test('agentSpeaking yalnızca canlıyken etkili', () => {
  const notLive = reduceVoiceSession(initialVoiceSession, {
    type: 'agentSpeaking',
    speaking: true,
  });
  assert.equal(notLive.agentSpeaking, false);
  const live = run([
    { type: 'connect' },
    { type: 'connected' },
    { type: 'agentSpeaking', speaking: true },
  ]);
  assert.equal(live.agentSpeaking, true);
});

test('canBargeIn: yalnızca canlı + susturulmamışken true', () => {
  const live = run([{ type: 'connect' }, { type: 'connected' }]);
  assert.equal(canBargeIn(live), true);
  const muted = reduceVoiceSession(live, { type: 'setMuted', muted: true });
  assert.equal(canBargeIn(muted), false);
  assert.equal(canBargeIn(initialVoiceSession), false);
});

test('setMuted bağlantı durumunu değiştirmeden mikrofonu değiştirir', () => {
  const live = run([{ type: 'connect' }, { type: 'connected' }, { type: 'setMuted', muted: true }]);
  assert.equal(live.conn, 'live');
  assert.equal(live.muted, true);
});
