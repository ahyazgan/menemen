/**
 * Lezzet — anahtar-saklayan proxy (sıfır bağımlılık, node:http).
 *
 * Amaç: API anahtarlarını MOBİL UYGULAMADAN ÇIKARMAK. Uygulama bu proxy'ye
 * konuşur; proxy gerçek sağlayıcıya iletir ve anahtarı sunucu tarafında
 * (ortam değişkeninden) ekler. Uygulamaya hiçbir gizli anahtar gömülmez.
 *
 * Güvenlik & gözlemlenebilirlik:
 *  - Kimlik: JWT (HS256, LEZZET_JWT_SECRET) > statik token (LEZZET_PROXY_TOKENS)
 *    > dev modu (auth kapalı). 401 + sebep döner.
 *  - Hız sınırı: anahtar (JWT sub / token / IP) başına RATE_LIMIT_RPM.
 *  - Gözlem: istek başına reqId, yapılandırılmış JSON log, /health, /metrics.
 *
 * Yollar:
 *   /anthropic/*   → https://api.anthropic.com/*   (x-api-key eklenir)
 *   /deepgram/*    → https://api.deepgram.com/*     (Authorization: Token)
 *   /elevenlabs/*  → https://api.elevenlabs.io/*    (xi-api-key)
 *   /health        → 200 (auth/rate-limit'siz)
 *   /metrics       → toplam sayaçlar (gizli yok)
 */
import http from 'node:http';
import https from 'node:https';
import { randomUUID } from 'node:crypto';

import { createRateLimiter } from './rateLimit.mjs';
import { verifyHS256 } from './jwt.mjs';
import { ALLOWLIST, isAllowed } from './allowlist.mjs';
import { contentLengthExceeds } from './bodyLimit.mjs';

const PORT = Number(process.env.PORT ?? 8787);
const JWT_SECRET = process.env.LEZZET_JWT_SECRET ?? '';
const CLIENT_TOKENS = (process.env.LEZZET_PROXY_TOKENS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const AUTH_MODE = JWT_SECRET ? 'jwt' : CLIENT_TOKENS.length > 0 ? 'token' : 'dev';
// Uç nokta allowlist'i varsayılan AÇIK; bilinçli kapatmak için LEZZET_ALLOWLIST=off.
const ALLOWLIST_ON = (process.env.LEZZET_ALLOWLIST ?? 'on') !== 'off';
// İstek gövdesi boyut limiti (DoS koruması). Ses/görsel için varsayılan 10 MB.
const MAX_BODY = Number(process.env.MAX_BODY_BYTES ?? 10 * 1024 * 1024);

const rateLimiter = createRateLimiter({
  limit: Number(process.env.RATE_LIMIT_RPM ?? 60),
  windowMs: 60_000,
});

const metrics = { total: 0, byStatus: {}, byRoute: {} };

const ROUTES = {
  '/anthropic': {
    host: 'api.anthropic.com',
    authHeaders: () => ({
      'x-api-key': required('ANTHROPIC_API_KEY'),
      'anthropic-version': '2023-06-01',
    }),
  },
  '/deepgram': {
    host: 'api.deepgram.com',
    authHeaders: () => ({ authorization: `Token ${required('DEEPGRAM_API_KEY')}` }),
  },
  '/elevenlabs': {
    host: 'api.elevenlabs.io',
    authHeaders: () => ({ 'xi-api-key': required('ELEVENLABS_API_KEY') }),
  },
};

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Eksik ortam değişkeni: ${name}`);
  return value;
}

function bearer(req) {
  const match = /^Bearer (.+)$/.exec(req.headers['authorization'] ?? '');
  return match?.[1];
}

/** @returns {{ ok: true, key: string } | { ok: false, status: number, reason: string }} */
function authenticate(req) {
  const ip = req.socket.remoteAddress ?? 'unknown';
  if (AUTH_MODE === 'dev') return { ok: true, key: ip };

  const token = bearer(req);
  if (!token) return { ok: false, status: 401, reason: 'missing_bearer' };

  if (AUTH_MODE === 'jwt') {
    const result = verifyHS256(token, JWT_SECRET);
    if (!result.valid) return { ok: false, status: 401, reason: `jwt_${result.reason}` };
    const sub = typeof result.payload.sub === 'string' ? result.payload.sub : 'jwt';
    return { ok: true, key: sub };
  }

  // token modu
  if (CLIENT_TOKENS.includes(token)) return { ok: true, key: `tok:${token.slice(0, 6)}` };
  return { ok: false, status: 401, reason: 'invalid_token' };
}

function log(entry) {
  process.stdout.write(`${JSON.stringify({ ts: new Date().toISOString(), ...entry })}\n`);
}

function finalize(res, reqId, route, status) {
  metrics.total += 1;
  const klass = `${Math.floor(status / 100)}xx`;
  metrics.byStatus[klass] = (metrics.byStatus[klass] ?? 0) + 1;
  metrics.byRoute[route] = (metrics.byRoute[route] ?? 0) + 1;
}

function send(res, status, body, reqId) {
  res.writeHead(status, { 'content-type': 'application/json', 'x-request-id': reqId });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const reqId = randomUUID();
  const started = Date.now();
  const url = req.url ?? '/';

  res.on('finish', () => {
    log({
      reqId,
      method: req.method,
      path: url.split('?')[0],
      status: res.statusCode,
      durationMs: Date.now() - started,
      authMode: AUTH_MODE,
    });
  });

  // Operasyonel uç noktalar — auth/rate-limit yok (üretimde ağ düzeyinde kısıtla).
  if (url === '/health') {
    finalize(res, reqId, '/health', 200);
    return send(res, 200, { status: 'ok', authMode: AUTH_MODE }, reqId);
  }
  if (url === '/metrics') {
    finalize(res, reqId, '/metrics', 200);
    return send(res, 200, metrics, reqId);
  }

  // 1) Kimlik doğrulama
  const auth = authenticate(req);
  if (!auth.ok) {
    finalize(res, reqId, 'auth', auth.status);
    return send(res, auth.status, { error: 'Yetkisiz', reason: auth.reason }, reqId);
  }

  // 2) Hız sınırlama (anahtar başına)
  const limit = rateLimiter.check(auth.key);
  if (!limit.allowed) {
    const retryAfter = Math.ceil(limit.retryAfterMs / 1000);
    finalize(res, reqId, 'ratelimit', 429);
    res.writeHead(429, {
      'content-type': 'application/json',
      'retry-after': String(retryAfter),
      'x-request-id': reqId,
    });
    return res.end(JSON.stringify({ error: 'Hız sınırı aşıldı.', retryAfterSeconds: retryAfter }));
  }

  // 3) Yönlendirme
  const prefix = Object.keys(ROUTES).find(
    (p) => url === p || url.startsWith(`${p}/`) || url.startsWith(`${p}?`),
  );
  if (!prefix) {
    finalize(res, reqId, 'unknown', 404);
    return send(res, 404, { error: 'Bilinmeyen yol' }, reqId);
  }

  const route = ROUTES[prefix];
  const upstreamPath = url.slice(prefix.length) || '/';

  // 4) Uç nokta allowlist'i — yalnızca beklenen method+yol geçer.
  if (ALLOWLIST_ON) {
    const pathname = upstreamPath.split('?')[0] ?? '/';
    if (!isAllowed(ALLOWLIST[prefix], req.method, pathname)) {
      finalize(res, reqId, prefix, 403);
      return send(res, 403, { error: 'İzinsiz uç nokta', reason: 'forbidden_endpoint' }, reqId);
    }
  }

  // 5) İstek gövdesi boyut limiti — Content-Length ön kontrolü.
  if (contentLengthExceeds(req.headers['content-length'], MAX_BODY)) {
    finalize(res, reqId, prefix, 413);
    return send(res, 413, { error: 'İstek çok büyük', reason: 'payload_too_large' }, reqId);
  }

  let authHeaders;
  try {
    authHeaders = route.authHeaders();
  } catch (err) {
    finalize(res, reqId, prefix, 500);
    return send(res, 500, { error: String(err instanceof Error ? err.message : err) }, reqId);
  }

  const upstream = https.request(
    {
      host: route.host,
      path: upstreamPath,
      method: req.method,
      headers: {
        host: route.host,
        'content-type': req.headers['content-type'] ?? 'application/json',
        accept: req.headers['accept'] ?? '*/*',
        ...authHeaders,
      },
    },
    (up) => {
      finalize(res, reqId, prefix, up.statusCode ?? 502);
      res.writeHead(up.statusCode ?? 502, { ...up.headers, 'x-request-id': reqId });
      up.pipe(res);
    },
  );

  upstream.on('error', (err) => {
    finalize(res, reqId, prefix, 502);
    send(res, 502, { error: `Upstream hatası: ${err.message}` }, reqId);
  });

  // Content-Length yoksa (chunked) akış sırasında boyutu denetle.
  let received = 0;
  let aborted = false;
  req.on('data', (chunk) => {
    received += chunk.length;
    if (received > MAX_BODY && !aborted) {
      aborted = true;
      upstream.destroy();
      if (!res.headersSent) {
        finalize(res, reqId, prefix, 413);
        send(res, 413, { error: 'İstek çok büyük', reason: 'payload_too_large' }, reqId);
      }
      req.destroy();
    }
  });

  req.pipe(upstream);
});

server.listen(PORT, () => {
  log({ event: 'listen', port: PORT, authMode: AUTH_MODE });
  if (AUTH_MODE === 'dev') {
    console.warn('⚠️  Auth KAPALI (dev). Üretimde LEZZET_JWT_SECRET veya LEZZET_PROXY_TOKENS ayarla.');
  }
});
