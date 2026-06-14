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
