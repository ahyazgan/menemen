/**
 * Süre biçimlendirme (saf, test edilebilir). Çıplak saniye yerine dakika:saniye
 * ("3:05") gösterir — uzun pişirme süreleri için okunabilir.
 */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
