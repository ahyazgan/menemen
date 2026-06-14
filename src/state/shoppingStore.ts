/**
 * shoppingStore — alışveriş listesini reaktif tutar ve KeyValueStore ile
 * kalıcılaştırır. Saf liste mantığı recipes/shopping.ts'te ve testli.
 */
import { create } from 'zustand';

import {
  addShoppingItems,
  clearChecked as clearCheckedItems,
  parseShoppingItems,
  removeShoppingItem,
  serializeShoppingItems,
  toggleShoppingChecked,
  type ShoppingItem,
} from '../recipes/shopping';
import { createMemoryStore, type KeyValueStore } from '../services/storage';

const KEY = 'lezzet.shopping';

interface ShoppingState {
  store: KeyValueStore;
  items: ShoppingItem[];
  setStore: (store: KeyValueStore) => void;
  load: () => Promise<void>;
  add: (items: ShoppingItem[]) => Promise<void>;
  toggle: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clearChecked: () => Promise<void>;
  clearAll: () => Promise<void>;
}

export const useShoppingStore = create<ShoppingState>((set, get) => {
  async function persist(items: ShoppingItem[]): Promise<void> {
    set({ items });
    await get().store.setItem(KEY, serializeShoppingItems(items));
  }
  return {
    store: createMemoryStore(),
    items: [],

    setStore: (store) => set({ store }),

    load: async () => {
      const raw = await get().store.getItem(KEY);
      set({ items: parseShoppingItems(raw) });
    },

    add: (items) => persist(addShoppingItems(get().items, items)),
    toggle: (id) => persist(toggleShoppingChecked(get().items, id)),
    remove: (id) => persist(removeShoppingItem(get().items, id)),
    clearChecked: () => persist(clearCheckedItems(get().items)),
    clearAll: () => persist([]),
  };
});
