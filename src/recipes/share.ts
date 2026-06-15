/**
 * Paylaşım metni üretimi (saf, testli). "Bunu yaptım, sen de dene" viral tohumu:
 * tarifin derin bağlantısı + şablona göre sıcak bir mesaj. Şablonlar i18n'de;
 * burada yalnızca bağlantı üretimi ve yer tutucu doldurma var (dilden bağımsız).
 */

/** Tarife açılan derin bağlantı (app.json scheme: "lezzet"). */
export function recipeDeepLink(id: string): string {
  return `lezzet://recipe/${id}`;
}

/**
 * Şablondaki {title} ve {link} yer tutucularını doldurur. Şablon kullanıcı
 * dilinde i18n'den gelir (örn. 'Az önce "{title}" yaptım… {link}').
 */
export function buildShareText(template: string, title: string, link: string): string {
  return template.replace(/\{title\}/g, title).replace(/\{link\}/g, link);
}

/**
 * Gelen derin bağlantıdan tarif id'sini çıkarır (paylaşımın diğer ucu).
 * "lezzet://recipe/<id>" biçimini, baştaki fazladan eğik çizgileri ve sorgu/parça
 * eklerini hoş görür. Eşleşme yoksa null.
 */
export function parseRecipeLink(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/lezzet:\/\/\/?recipe\/([^/?#]+)/i);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

/** Davet eden kullanıcının kodunu taşıyan tarif derin bağlantısı (viral atıf). */
export function buildReferralLink(recipeId: string, code: string): string {
  return `${recipeDeepLink(recipeId)}?ref=${encodeURIComponent(code)}`;
}

/** Gelen bağlantıdan davet kodunu (?ref=...) çıkarır. Yoksa null. */
export function parseReferral(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/[?&]ref=([^&#]+)/i);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

/**
 * Takma adlı (pseudonymous) davet kodu üretir — kimlik/PII içermez. `rand`
 * enjekte edilir → deterministik test. 8 karakter base36.
 */
export function genReferralCode(rand: () => number = Math.random): string {
  let code = '';
  while (code.length < 8) {
    code += Math.floor(rand() * 36 ** 6)
      .toString(36)
      .padStart(6, '0');
  }
  return code.slice(0, 8);
}
