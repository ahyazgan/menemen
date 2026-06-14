/** Bellekte anahtar-değer deposu — test/dev (kalıcı değil). */
import type { KeyValueStore } from './types';

export function createMemoryStore(initial: Record<string, string> = {}): KeyValueStore {
  const map = new Map<string, string>(Object.entries(initial));
  return {
    async getItem(key: string): Promise<string | null> {
      return map.has(key) ? (map.get(key) ?? null) : null;
    },
    async setItem(key: string, value: string): Promise<void> {
      map.set(key, value);
    },
    async removeItem(key: string): Promise<void> {
      map.delete(key);
    },
  };
}
