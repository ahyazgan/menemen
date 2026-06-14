/**
 * Alışveriş listesi öğeleri için saf yardımcılar (test edilebilir). Kalıcılık
 * shoppingStore + services/storage'da; burada yalnızca veri dönüşümleri.
 */
export interface ShoppingItem {
  /** Kararlı kimlik (yinelenmeyi önler). */
  id: string;
  /** Eklendiği andaki dile göre etiket (örn. "2 adet domates"). */
  label: string;
  checked: boolean;
}

export function parseShoppingItems(raw: string | null): ShoppingItem[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter(
      (x): x is ShoppingItem =>
        !!x &&
        typeof (x as ShoppingItem).id === 'string' &&
        typeof (x as ShoppingItem).label === 'string' &&
        typeof (x as ShoppingItem).checked === 'boolean',
    );
  } catch {
    return [];
  }
}

export function serializeShoppingItems(items: ShoppingItem[]): string {
  return JSON.stringify(items);
}

/** Yeni öğeleri ekler; aynı id'liler atlanır (yinelenme yok). */
export function addShoppingItems(items: ShoppingItem[], incoming: ShoppingItem[]): ShoppingItem[] {
  const seen = new Set(items.map((i) => i.id));
  const fresh = incoming.filter((i) => !seen.has(i.id));
  return [...items, ...fresh];
}

export function toggleShoppingChecked(items: ShoppingItem[], id: string): ShoppingItem[] {
  return items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i));
}

export function removeShoppingItem(items: ShoppingItem[], id: string): ShoppingItem[] {
  return items.filter((i) => i.id !== id);
}

/** İşaretlenmiş (alınmış) öğeleri listeden çıkarır. */
export function clearChecked(items: ShoppingItem[]): ShoppingItem[] {
  return items.filter((i) => !i.checked);
}
