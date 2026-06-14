/** Saf yardımcı: Content-Length başlığı limiti aşıyor mu? (testlenebilir) */
export function contentLengthExceeds(header, max) {
  if (header == null) return false;
  const n = Number(header);
  return Number.isFinite(n) && n > max;
}
