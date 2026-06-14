/**
 * Basit anahtar-değer kalıcılık arayüzü (favoriler vb.). Interface arkasında —
 * store yalnızca bunu çağırır, native AsyncStorage'ı görmez.
 */
export interface KeyValueStore {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
