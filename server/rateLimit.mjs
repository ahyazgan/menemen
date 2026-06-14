/**
 * Saf, sabit-pencere hız sınırlayıcı (sıfır bağımlılık, test edilebilir).
 * Anahtar başına `limit` istek / `windowMs` pencere. Saat enjekte edilebilir.
 */
export function createRateLimiter({ limit = 60, windowMs = 60_000, now = () => Date.now() } = {}) {
  /** key -> { count, resetAt } */
  const hits = new Map();

  function prune(t) {
    if (hits.size < 10_000) return; // küçük tutmak için ara sıra temizle
    for (const [key, entry] of hits) {
      if (t >= entry.resetAt) hits.delete(key);
    }
  }

  return {
    /** İsteği say; { allowed, remaining, retryAfterMs } döndürür. */
    check(key) {
      const t = now();
      const entry = hits.get(key);
      if (!entry || t >= entry.resetAt) {
        prune(t);
        hits.set(key, { count: 1, resetAt: t + windowMs });
        return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
      }
      if (entry.count >= limit) {
        return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - t };
      }
      entry.count += 1;
      return { allowed: true, remaining: limit - entry.count, retryAfterMs: 0 };
    },
  };
}
