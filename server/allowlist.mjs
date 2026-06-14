/**
 * Uç nokta allowlist'i (saf, testlenebilir). Proxy yalnızca uygulamanın gerçekten
 * kullandığı method + yol kombinasyonlarını iletir; gerisi 403. Çalınmış bir
 * istemci token'ıyla keyfi sağlayıcı uç noktasına gidilmesini engeller.
 *
 * Yollar prefix sonrası (upstream) ve sorgu dizesi HARİÇ değerlendirilir.
 */
export const ALLOWLIST = {
  '/anthropic': [{ method: 'POST', path: /^\/v1\/messages$/ }],
  '/deepgram': [{ method: 'POST', path: /^\/v1\/listen$/ }],
  '/elevenlabs': [{ method: 'POST', path: /^\/v1\/text-to-speech\/[^/]+$/ }],
};

/** rules: [{ method, path(RegExp) }]; izin verilen method+yol ise true. */
export function isAllowed(rules, method, pathname) {
  if (!rules) return false;
  return rules.some((rule) => rule.method === method && rule.path.test(pathname));
}
