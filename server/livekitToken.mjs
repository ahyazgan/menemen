/**
 * LiveKit erişim token'ı (JWT, HS256) — SIFIR bağımlılık, yalnızca node:crypto.
 * API secret SUNUCUDA kalır; uygulamaya gömülmez (CLAUDE.md). Token kısa ömürlü
 * olmalı (varsayılan 1 saat). LiveKit grant şeması: video.roomJoin + room.
 */
import { createHmac } from 'node:crypto';

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * @param {{ apiKey: string, apiSecret: string, identity: string, room: string,
 *   ttlSeconds?: number, metadata?: string }} opts
 * @returns {string} imzalı JWT
 */
export function createLiveKitToken(opts) {
  const { apiKey, apiSecret, identity, room, ttlSeconds = 3600, metadata } = opts;
  if (!apiKey || !apiSecret) throw new Error('LiveKit API anahtarı/secret yok');
  if (!identity || !room) throw new Error('identity ve room gerekli');

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    iss: apiKey,
    sub: identity,
    nbf: now,
    exp: now + ttlSeconds,
    video: { room, roomJoin: true, canPublish: true, canSubscribe: true },
  };
  if (metadata) payload.metadata = metadata;

  const head = base64url(JSON.stringify(header));
  const body = base64url(JSON.stringify(payload));
  const data = `${head}.${body}`;
  const sig = base64url(createHmac('sha256', apiSecret).update(data).digest());
  return `${data}.${sig}`;
}

/** Test/doğrulama yardımcı: JWT payload'ını çöz (imza doğrulamaz). */
export function decodeJwtPayload(token) {
  const part = String(token).split('.')[1] ?? '';
  const json = Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
  return JSON.parse(json);
}
