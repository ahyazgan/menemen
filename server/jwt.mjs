/**
 * Minimal HS256 JWT doğrulayıcı (saf, sıfır bağımlılık — node:crypto).
 * Üretimde statik token yerine kendi kimlik sağlayıcının imzaladığı JWT'leri
 * doğrulamak için. İmza + exp/nbf kontrol edilir; saat enjekte edilebilir (test).
 *
 * Not: yalnızca HS256 (paylaşılan sır). RS256 gerekiyorsa createVerify ile
 * genişletilebilir; arayüz aynı kalır.
 */
import { createHmac, createPublicKey, createSign, timingSafeEqual, verify as cryptoVerify } from 'node:crypto';

function decodeJsonSegment(segment) {
  return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));
}

/**
 * @returns {{ valid: true, payload: object } | { valid: false, reason: string }}
 */
export function verifyHS256(token, secret, { now = () => Date.now() } = {}) {
  if (!token || typeof token !== 'string') return { valid: false, reason: 'missing' };
  if (!secret) return { valid: false, reason: 'no_secret' };

  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false, reason: 'malformed' };
  const [headerB64, payloadB64, signatureB64] = parts;

  let header;
  let payload;
  try {
    header = decodeJsonSegment(headerB64);
    payload = decodeJsonSegment(payloadB64);
  } catch {
    return { valid: false, reason: 'malformed' };
  }

  if (header.alg !== 'HS256') return { valid: false, reason: 'unsupported_alg' };

  const expected = createHmac('sha256', secret).update(`${headerB64}.${payloadB64}`).digest();
  const provided = Buffer.from(signatureB64, 'base64url');
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    return { valid: false, reason: 'bad_signature' };
  }

  const nowSec = Math.floor(now() / 1000);
  if (typeof payload.exp === 'number' && nowSec >= payload.exp) {
    return { valid: false, reason: 'expired' };
  }
  if (typeof payload.nbf === 'number' && nowSec < payload.nbf) {
    return { valid: false, reason: 'not_yet_valid' };
  }

  return { valid: true, payload };
}

/** Test/araç amaçlı küçük HS256 imzalayıcı (üretim kimlik sağlayıcısı için değil). */
export function signHS256(payload, secret, header = { alg: 'HS256', typ: 'JWT' }) {
  const enc = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const head = enc(header);
  const body = enc(payload);
  const sig = createHmac('sha256', secret).update(`${head}.${body}`).digest('base64url');
  return `${head}.${body}.${sig}`;
}

/**
 * RS256 doğrulama. `key`: PEM (SPKI string) veya JWK nesnesi. Üretimde kimlik
 * sağlayıcının açık anahtarı (RSA) ile imza + exp/nbf doğrulanır.
 */
export function verifyRS256(token, key, { now = () => Date.now() } = {}) {
  if (!token || typeof token !== 'string') return { valid: false, reason: 'missing' };
  if (!key) return { valid: false, reason: 'no_key' };

  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false, reason: 'malformed' };
  const [headerB64, payloadB64, signatureB64] = parts;

  let header;
  let payload;
  try {
    header = decodeJsonSegment(headerB64);
    payload = decodeJsonSegment(payloadB64);
  } catch {
    return { valid: false, reason: 'malformed' };
  }
  if (header.alg !== 'RS256') return { valid: false, reason: 'unsupported_alg' };

  let keyObject;
  try {
    keyObject = typeof key === 'string' ? createPublicKey(key) : createPublicKey({ key, format: 'jwk' });
  } catch {
    return { valid: false, reason: 'bad_key' };
  }

  let ok = false;
  try {
    ok = cryptoVerify(
      'RSA-SHA256',
      Buffer.from(`${headerB64}.${payloadB64}`),
      keyObject,
      Buffer.from(signatureB64, 'base64url'),
    );
  } catch {
    return { valid: false, reason: 'bad_signature' };
  }
  if (!ok) return { valid: false, reason: 'bad_signature' };

  const nowSec = Math.floor(now() / 1000);
  if (typeof payload.exp === 'number' && nowSec >= payload.exp) return { valid: false, reason: 'expired' };
  if (typeof payload.nbf === 'number' && nowSec < payload.nbf) return { valid: false, reason: 'not_yet_valid' };

  return { valid: true, payload };
}

/**
 * JWKS (JSON Web Key Set) ile RS256 doğrulama. Token header'ındaki `kid`'e göre
 * uygun anahtar seçilir (yoksa ilk anahtar). `jwks`: { keys: [JWK, ...] }.
 */
export function verifyJwtWithJwks(token, jwks, opts = {}) {
  const parts = typeof token === 'string' ? token.split('.') : [];
  if (parts.length !== 3) return { valid: false, reason: 'malformed' };
  let header;
  try {
    header = decodeJsonSegment(parts[0]);
  } catch {
    return { valid: false, reason: 'malformed' };
  }
  const keys = jwks?.keys ?? [];
  const jwk = header.kid ? keys.find((k) => k.kid === header.kid) : keys[0];
  if (!jwk) return { valid: false, reason: 'unknown_kid' };
  return verifyRS256(token, jwk, opts);
}

/** Test/araç amaçlı RS256 imzalayıcı (özel anahtar ile). */
export function signRS256(payload, privateKey, header = { alg: 'RS256', typ: 'JWT' }) {
  const enc = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const head = enc(header);
  const body = enc(payload);
  const sig = createSign('RSA-SHA256').update(`${head}.${body}`).end().sign(privateKey).toString('base64url');
  return `${head}.${body}.${sig}`;
}
