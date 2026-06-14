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
 * Bu bir İSKELET'tir: üretimde kimlik doğrulama (kendi kullanıcı oturumun),
 * hız sınırlama ve izin verilen uç nokta listesi ekle.
 */
import http from 'node:http';
import https from 'node:https';

const PORT = Number(process.env.PORT ?? 8787);

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

const server = http.createServer((req, res) => {
  const url = req.url ?? '/';
  const prefix = Object.keys(ROUTES).find((p) => url === p || url.startsWith(`${p}/`) || url.startsWith(`${p}?`));

  if (!prefix) {
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'Bilinmeyen yol' }));
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
