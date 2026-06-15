/**
 * Saf motor testlerini harici @types/node gerekmeden derleyebilmek için minimal
 * tip bildirimleri. Yalnızca test araçları içindir; uygulama koduna dahil değil.
 */
declare module 'node:test' {
  function test(name: string, fn: () => void | Promise<void>): void;
  export default test;
}

declare module 'node:assert/strict' {
  interface Assert {
    (value: unknown, message?: string): void;
    equal(actual: unknown, expected: unknown, message?: string): void;
    deepEqual(actual: unknown, expected: unknown, message?: string): void;
    ok(value: unknown, message?: string): void;
    throws(fn: () => unknown, expected?: unknown): void;
    doesNotThrow(fn: () => unknown, message?: string): void;
  }
  const assert: Assert;
  export default assert;
}

// Zamanlayıcı globalleri (engine/async.ts için; @types/node olmadan derlensin).
declare function setTimeout(handler: () => void, ms: number): number;
declare function clearTimeout(id: number): void;
