/**
 * JWKS önbelleği (saf, testlenebilir). `fetcher` JWKS nesnesini ({ keys }) getirir;
 * sonuç `ttlMs` boyunca önbellekte tutulur. Eşzamanlı istekler tek fetch'e
 * indirgenir (inflight dedup). Saat enjekte edilebilir.
 */
export function createJwksCache({ fetcher, ttlMs = 3_600_000, now = () => Date.now() } = {}) {
  let cached = null; // { value, at }
  let inflight = null;

  function refresh() {
    inflight = (async () => {
      try {
        const value = await fetcher();
        cached = { value, at: now() };
        return value;
      } finally {
        inflight = null;
      }
    })();
    return inflight;
  }

  return {
    async get() {
      const t = now();
      if (cached && t - cached.at < ttlMs) return cached.value;
      if (inflight) return inflight;
      return refresh();
    },
    peek() {
      return cached?.value ?? null;
    },
  };
}
