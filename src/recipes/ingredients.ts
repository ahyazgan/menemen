/**
 * Malzeme ölçekleme ve etiketleme (saf — test edilebilir). Porsiyon ayarı
 * miktarları, alışveriş listesi de etiketleri buradan üretir.
 */
import type { Ingredient } from '../engine/types';
import { localize } from '../engine/localize';

/** Miktarı porsiyona göre ölçekler. Miktar yoksa undefined döner. */
export function scaleQuantity(
  quantity: number | undefined,
  fromServings: number,
  toServings: number,
): number | undefined {
  if (quantity == null) return undefined;
  if (!fromServings || fromServings <= 0) return quantity;
  return (quantity * toServings) / fromServings;
}

/** Miktarı okunabilir biçimde yazar (gereksiz ondalıkları atar). */
export function formatQuantity(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

/**
 * Bir malzemenin tek satırlık, dile ve porsiyona göre etiketi.
 * Örn. "2 adet domates" / "2 pcs tomato". Miktar yoksa yalnızca ad.
 */
export function ingredientLabel(
  ingredient: Ingredient,
  fromServings: number,
  toServings: number,
  locale: string,
): string {
  const name = localize(ingredient.name, locale);
  const scaled = scaleQuantity(ingredient.quantity, fromServings, toServings);
  if (scaled == null) return name;
  const unit = ingredient.unit ? localize(ingredient.unit, locale) : '';
  return `${formatQuantity(scaled)}${unit ? ` ${unit}` : ''} ${name}`.trim();
}
