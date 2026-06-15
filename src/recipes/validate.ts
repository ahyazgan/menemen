/**
 * Uzak (CMS/remote) tarif içeriğinin çalışma-zamanı doğrulaması. Remote içerik
 * GÜVENİLMEZDİR → her tarif yapısal olarak doğrulanır ve gerçek motorla (DAG +
 * bilinmeyen bağımlılık kontrolü) sınanır; bozuk olan SESSİZCE düşülür (uygulama
 * çökmez). Saf modül — test edilebilir.
 *
 * Not: Gıda güvenliği motor tarafından çalışma zamanında ZORLANIR (kritik adım
 * atlanamaz); doğrulama yalnızca yapıyı garanti eder.
 */
import type {
  CompletionType,
  Ingredient,
  LocalizedText,
  NodeKind,
  Recipe,
  RecipeNode,
} from '../engine/types';
import { RecipeEngine } from '../engine/RecipeEngine';

const KINDS: readonly NodeKind[] = ['prep', 'action', 'finish'];
const COMPLETIONS: readonly CompletionType[] = ['user', 'timer', 'vision', 'auto'];

function isLocalizedText(v: unknown): v is LocalizedText {
  if (typeof v === 'string') return v.length > 0;
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const vals = Object.values(v as Record<string, unknown>);
    return vals.length > 0 && vals.every((x) => typeof x === 'string');
  }
  return false;
}

function asStringArray(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  return v.every((x) => typeof x === 'string') ? (v as string[]) : null;
}

function validateNode(raw: unknown): RecipeNode | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== 'string' || !r.id) return null;
  if (!isLocalizedText(r.title) || !isLocalizedText(r.instruction)) return null;
  if (!KINDS.includes(r.kind as NodeKind)) return null;
  if (!COMPLETIONS.includes(r.completion as CompletionType)) return null;
  const requires = asStringArray(r.requires) ?? (r.requires === undefined ? [] : null);
  if (requires === null) return null;
  if (r.durationSec !== undefined && typeof r.durationSec !== 'number') return null;

  const node: RecipeNode = {
    id: r.id,
    title: r.title,
    instruction: r.instruction,
    kind: r.kind as NodeKind,
    requires,
    completion: r.completion as CompletionType,
  };
  if (typeof r.durationSec === 'number') node.durationSec = r.durationSec;
  if (isLocalizedText(r.voice_on_enter)) node.voice_on_enter = r.voice_on_enter;
  if (isLocalizedText(r.voice_on_complete)) node.voice_on_complete = r.voice_on_complete;

  // Gıda güvenliği kısıtı: varsa yapısı doğru olmalı.
  if (r.safety !== undefined) {
    const s = r.safety as Record<string, unknown>;
    if (!s || typeof s !== 'object' || typeof s.critical !== 'boolean') return null;
    if (!isLocalizedText(s.message)) return null;
    node.safety = {
      critical: s.critical,
      message: s.message,
      ...(typeof s.minInternalTempC === 'number' ? { minInternalTempC: s.minInternalTempC } : {}),
    };
  }
  return node;
}

function validateIngredient(raw: unknown): Ingredient | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (!isLocalizedText(r.name)) return null;
  const ing: Ingredient = { name: r.name };
  if (typeof r.quantity === 'number') ing.quantity = r.quantity;
  if (isLocalizedText(r.unit)) ing.unit = r.unit;
  return ing;
}

/** Tek bir uzak tarifi doğrula. Geçersizse null. */
export function validateRecipe(raw: unknown): Recipe | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== 'string' || !r.id) return null;
  if (!isLocalizedText(r.title)) return null;
  if (typeof r.servings !== 'number' || r.servings <= 0) return null;
  if (typeof r.locale !== 'string' || !r.locale) return null;
  if (!Array.isArray(r.nodes) || r.nodes.length === 0) return null;

  const nodes: RecipeNode[] = [];
  for (const n of r.nodes) {
    const node = validateNode(n);
    if (!node) return null; // tek bozuk düğüm → tüm tarif reddedilir
    nodes.push(node);
  }

  const recipe: Recipe = {
    id: r.id,
    title: r.title,
    servings: r.servings,
    locale: r.locale,
    nodes,
  };
  if (isLocalizedText(r.summary)) recipe.summary = r.summary;
  if (typeof r.totalMinutes === 'number') recipe.totalMinutes = r.totalMinutes;
  if (typeof r.category === 'string') recipe.category = r.category as Recipe['category'];
  if (Array.isArray(r.ingredients)) {
    const ings: Ingredient[] = [];
    for (const i of r.ingredients) {
      const ing = validateIngredient(i);
      if (ing) ings.push(ing);
    }
    if (ings.length > 0) recipe.ingredients = ings;
  }

  // Gerçek motorla sına: geçerli DAG mı, bağımlılıklar tanımlı mı? Değilse reddet.
  try {
    new RecipeEngine(recipe);
  } catch {
    return null;
  }
  return recipe;
}

/** Bir uzak tarif dizisini doğrula; yalnızca geçerli olanları döndür. */
export function parseRemoteRecipes(raw: unknown): Recipe[] {
  if (!Array.isArray(raw)) return [];
  const out: Recipe[] = [];
  for (const item of raw) {
    const recipe = validateRecipe(item);
    if (recipe) out.push(recipe);
  }
  return out;
}
