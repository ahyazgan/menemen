/**
 * Gıda güvenliği kuralı — motorun zorunlu kıldığı ve asistanın daima uyduğu
 * sert bir kısıt (CLAUDE.md → GIDA GÜVENLİĞİ — KRİTİK KURAL).
 *
 * Kural: Lezzet asla "kesinlikle pişti / yenebilir" demez. Vision yalnızca
 * GÖZLEM + ÖNERİ verir; şüphede "biraz daha pişir" tarafına düşer. Güvenlik
 * açısından kritik bir adım ATLANAMAZ.
 *
 * Bu modül SAFTIR ve motorun geri kalanına bağlı değildir; servisler (örn.
 * Vision "pişmiş mi?") ve UI tarafından da yeniden kullanılabilir.
 */
import type { Recipe, RecipeNode } from './types';

/** Güvenli minimum iç pişirme sıcaklıkları (°C). Kamuya açık rehberlerden. */
export const SAFE_MIN_TEMP_C = {
  poultry: 74, // tavuk, hindi
  groundMeat: 71, // köfte, kıyma, burger
  porkRedMeatRoasts: 63, // ardından dinlendirme
  fish: 63,
  eggDishes: 71, // menemen, omlet, muhallebi
  reheatedLeftovers: 74,
} as const;

export type FoodCategory = keyof typeof SAFE_MIN_TEMP_C;

/** Kritik bir adımı atlatmaya çalışınca fırlatılır. */
export class SafetyError extends Error {
  constructor(
    message: string,
    readonly nodeId: string,
  ) {
    super(message);
    this.name = 'SafetyError';
  }
}

/** Kritik olmayan (veya güvenlik kuralı olmayan) bir adım atlanabilir. */
export function canSkipNode(node: RecipeNode): boolean {
  return !node.safety?.critical;
}

/**
 * Adım atlanamıyorsa {@link SafetyError} fırlatır. Bunu sınırda (store action)
 * çağır ki UI yakalayıp nedeni açıklayabilsin.
 */
export function assertSkippable(node: RecipeNode): void {
  if (!canSkipNode(node)) {
    throw new SafetyError(
      node.safety?.message ?? `"${node.title}" güvenlik açısından atlanamaz.`,
      node.id,
    );
  }
}

/**
 * Ölçülen iç sıcaklık, kategori için güvenli minimuma ulaştı mı?
 * Dikkat: bu bir KESİN HÜKÜM değil, ölçüme dayalı bir kontroldür. Vision'dan
 * gelen görsel tahminlerde asla "tamam" demek için kullanılmaz.
 */
export function reachesSafeTemp(measuredC: number, category: FoodCategory): boolean {
  return measuredC >= SAFE_MIN_TEMP_C[category];
}

/**
 * Şüpheli/güvenli olmayan bir Vision gözlemini, kurala uygun bir ÖNERİYE
 * çevirir. Asla onay vermez; daima "biraz daha pişir" tarafına düşer.
 */
export function safeCookingAdvice(category: FoodCategory): string {
  const t = SAFE_MIN_TEMP_C[category];
  return `Emin olamıyorum — biraz daha pişirelim. Mümkünse iç sıcaklığa bak, ${t}°C olmalı.`;
}

/** Bir tarifin bildirdiği tüm güvenlik uyarıları (baştan bilgilendirme için). */
export function safetyWarnings(recipe: Recipe): { nodeId: string; message: string }[] {
  return recipe.nodes
    .filter((n) => n.safety)
    .map((n) => ({ nodeId: n.id, message: n.safety!.message }));
}
