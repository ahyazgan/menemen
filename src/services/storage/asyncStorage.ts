/** AsyncStorage tabanlı kalıcı anahtar-değer deposu (cihazda). */
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { KeyValueStore } from './types';

export function createAsyncStorage(): KeyValueStore {
  return {
    getItem: (key) => AsyncStorage.getItem(key),
    setItem: (key, value) => AsyncStorage.setItem(key, value),
    removeItem: (key) => AsyncStorage.removeItem(key),
  };
}
