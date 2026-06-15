/**
 * Yerel niyet ayrıştırma (saf, test edilebilir — React/Expo/servis importu YOK).
 * Kullanıcının sesli/yazılı kısa komutunu kural tabanlı eşlemeyle niyete çevirir.
 * Claude/anahtar GEREKTİRMEZ — cihaz-içi STT ya da yazılı komutla çalışır; TR+EN.
 *
 * IntentKind burada (motor = domain sözlüğü) tanımlanır; servis katmanı bunu
 * re-export eder (services/types).
 */

/** Mutfak bağlamındaki komut niyetleri. UNKNOWN her zaman güvenli geri dönüş. */
export type IntentKind =
  | 'next' // "tamam", "bitti", "next"
  | 'repeat' // "tekrar et", "say again"
  | 'how_long' // "ne kadar kaldı", "how long"
  | 'what_now' // "şimdi ne yapayım", "what now"
  | 'ingredients' // "malzemeler neydi", "ingredients"
  | 'pause' // "dur", "bekle", "pause"
  | 'resume' // "devam", "resume"
  | 'check' // "bir bak", "check" → Vision
  | 'recovery' // "yaktım", "too salty"
  | 'unknown';

export interface IntentMatch {
  kind: IntentKind;
  /** recovery için yakalanan ipucu anahtarı (örn. "yaktim"). */
  recoveryKey?: string;
  /** 0..1 güven. */
  confidence: number;
}

/**
 * Niyet → eşleşme kalıpları (TR + EN). Sıra önemlidir (önce gelen kazanır).
 * Türkçe sondan eklemeli olduğu için kök kalıplarda sonda `\b` kullanılmaz
 * (ör. "malzeme" → "malzemeler"); kısa/çok-anlamlı sözcüklerde sınır korunur.
 */
const PATTERNS: { kind: IntentKind; re: RegExp }[] = [
  { kind: 'pause', re: /\b(duraklat|dur|bekle|pause|wait|hold on)\b/i },
  { kind: 'resume', re: /\b(devam|kaldığ|resume|continue|go on)\b/i },
  {
    kind: 'how_long',
    re: /\b(ne kadar|kaç dakika|kaç saniye|süre|how long|how much time|time left)\b/i,
  },
  {
    kind: 'what_now',
    re: /\b(şimdi ne|ne yapay[ıi]m|sırada ne|what now|next step|what do i do)\b/i,
  },
  { kind: 'ingredients', re: /(malzeme|neler laz[ıi]m|ne gerek|ingredient|what do i need)/i },
  {
    kind: 'check',
    re: /\b(kontrol|göz at|nas[ıi]l olmuş|check|look|how does it look)\b|\bbak\b/i,
  },
  { kind: 'repeat', re: /\b(tekrar|ne demiştin|bir daha|anlamad|repeat|say again|again)\b/i },
  {
    kind: 'next',
    re: /\b(tamam|bitti|oldu|sonraki|geçtim|next|done|finished|ready|okay|ok)\b/i,
  },
];

/** Kurtarma ipuçları → anahtar (TR + EN). Kök kalıp (Türkçe ekleri yakalar). */
const RECOVERY: { key: string; re: RegExp }[] = [
  { key: 'yaktim', re: /\b(yakt|yand|kömür|burn)/i },
  { key: 'tuzlu', re: /\b(tuzlu|çok tuz|salty)/i },
  { key: 'sulu', re: /\b(sulu|cıvık|fazla su|watery|runny)/i },
];

/**
 * Metni niyete çevirir. Önce kurtarma (yalnızca o adımda tanımlı anahtarlardan
 * biriyse), sonra komut kalıpları; hiçbiri tutmazsa düşük güvenli `unknown`.
 */
export function matchIntent(text: string, recoveryKeys: string[] = []): IntentMatch {
  const recovery = RECOVERY.find((r) => r.re.test(text));
  if (recovery && recoveryKeys.includes(recovery.key)) {
    return { kind: 'recovery', recoveryKey: recovery.key, confidence: 0.8 };
  }
  const match = PATTERNS.find((p) => p.re.test(text));
  if (match) return { kind: match.kind, confidence: 0.85 };
  return { kind: 'unknown', confidence: 0.3 };
}
