/**
 * Lezzet — minimal anahtar-saklayan proxy iskeleti (sıfır bağımlılık, node:http).
 *
 * Amaç: API anahtarlarını MOBİL UYGULAMADAN ÇIKARMAK. Uygulama bu proxy'ye
 * konuşur; proxy gerçek sağlayıcıya isteği iletir ve anahtarı sunucu tarafında
 * (ortam değişkeninden) ekler. Uygulamaya hiçbir gizli anahtar gömülmez.
 *
 * Çalıştırma:
 *   ANTHROPIC_API_KEY=... DEEPGRAM_API_KEY=... ELEVENLABS_API_KEY=... \
 *   node server/proxy.mjs
 *
 * Yollar:
 *   /anthropic/*   → https://api.anthropic.com/*   (x-api-key eklenir)
 *   /deepgram/*    → https://api.deepgram.com/*     (Authorization: Token)
 *   /elevenlabs/*  → https://api.elevenlabs.io/*    (xi-api-key)
 *
 * Güvenlik: istemci kimlik doğrulaması (Bearer token allowlist) ve anahtar
 * başına hız sınırlama içerir. Üretimde statik token yerine kendi kullanıcı
 * oturum doğrulamanı (JWT vb.) ve uç nokta allowlist'ini ekle.
 */
import http from 'node:http';
import https from 'node:https';

import { createRateLimiter } from './rateLimit.mjs';

const PORT = Number(process.env.PORT ?? 8787);

/** İstemci token allowlist'i (virgülle ayrılmış). Boşsa: dev modu (auth kapalı). */
const CLIENT_TOKENS = (process.env.LEZZET_PROXY_TOKENS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const rateLimiter = createRateLimiter({
  limit: Number(process.env.RATE_LIMIT_RPM ?? 60),
  windowMs: 60_000,
});

if (CLIENT_TOKENS.length === 0) {
  console.warn('⚠️  LEZZET_PROXY_TOKENS boş — kimlik doğrulama KAPALI (yalnızca dev).');
}

/**
 * İsteği doğrular. Dönüş: { ok: true, key } veya { ok: false, status }.
 * Token varsa rate-limit anahtarı token'dır; dev modunda IP'dir.
 */
function authenticate(req) {
  const ip = req.socket.remoteAddress ?? 'unknown';
  if (CLIENT_TOKENS.length === 0) return { ok: true, key: ip };

  const header = req.headers['authorization'] ?? '';
  const match = /^Bearer (.+)$/.exec(header);
  const token = match?.[1];
  if (token && CLIENT_TOKENS.includes(token)) return { ok: true, key: token };
  return { ok: false, status: 401 };
}

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

function deny(res, status, message) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: message }));
}

const server = http.createServer((req, res) => {
  const url = req.url ?? '/';

  // 1) Kimlik doğrulama
  const auth = authenticate(req);
  if (!auth.ok) {
    deny(res, auth.status, 'Yetkisiz: geçerli Bearer token gerekli.');
    return;
  }

  // 2) Hız sınırlama (anahtar başına)
  const limit = rateLimiter.check(auth.key);
  if (!limit.allowed) {
    const retryAfter = Math.ceil(limit.retryAfterMs / 1000);
    res.writeHead(429, { 'content-type': 'application/json', 'retry-after': String(retryAfter) });
    res.end(JSON.stringify({ error: 'Hız sınırı aşıldı.', retryAfterSeconds: retryAfter }));
    return;
  }

  // 3) Yönlendirme
  const prefix = Object.keys(ROUTES).find((p) => url === p || url.startsWith(`${p}/`) || url.startsWith(`${p}?`));
  if (!prefix) {
    deny(res, 404, 'Bilinmeyen yol');
    return;
  }

  const route = ROUTES[prefix];
  const upstreamPath = url.slice(prefix.length) || '/';

  let authHeaders;
  try {
    authHeaders = route.authHeaders();
  } catch (err) {
    res.writeHead(500, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: String(err instanceof Error ? err.message : err) }));
    return;
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
      res.writeHead(up.statusCode ?? 502, up.headers);
      up.pipe(res);
    },
  );

  upstream.on('error', (err) => {
    res.writeHead(502, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: `Upstream hatası: ${err.message}` }));
  });

  req.pipe(upstream);
});

server.listen(PORT, () => {
  console.log(`Lezzet proxy http://localhost:${PORT} üzerinde çalışıyor`);
  console.log('Yollar: /anthropic, /deepgram, /elevenlabs');
});
