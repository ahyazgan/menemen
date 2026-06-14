/**
 * Lezzet motorunun çekirdek tipleri.
 *
 * Bu modül SAFTIR: React yok, I/O yok, platform API'si yok (CLAUDE.md → Mimari).
 * Tarif = yürütülebilir bir graf. Düğümler işlerdir; kenarlar (`requires`)
 * bağımlılıklardır. Karşılanmamış bağımlılığı olmayan düğümler aynı anda
 * (paralel) yürüyebilir — örn. domates rendelenirken biber doğranır. Bu yapı
 * motoru deterministik ve test edilebilir kılar.
 */

/** Bir düğümün yaşam döngüsü. */
export type NodeStatus =
  | 'pending' // bağımlılıklar henüz karşılanmadı
  | 'ready' // bağımlılıklar tamam, başlatılabilir
  | 'active' // şu an yürüyor (aynı anda birden fazla olabilir)
  | 'done' // başarıyla tamamlandı
  | 'failed' // denendi ama ters gitti; tekrar denenebilir (kurtarma)
  | 'skipped'; // bilerek yapılmadı (yalnızca kritik olmayan adımlarda)

/** Düğüm türü (CLAUDE.md → State Machine: action/prep/finish). */
export type NodeKind = 'prep' | 'action' | 'finish';

/**
 * Çok dilli metin: ya düz string (tüm dillerde aynı / yalnızca kaynak dil) ya da
 * dil koduna göre eşleme ({ tr: "...", en: "..." }). `localize()` ile çözülür.
 * Geriye dönük uyumlu: eski düz string'ler olduğu gibi çalışır.
 */
export type LocalizedText = string | Record<string, string>;

/**
 * Tamamlanma türü — bir düğümün nasıl "done" olacağını belirler.
 * - user:   sesli onay (kullanıcı "tamam/bitti" der)
 * - timer:  süre dolunca
 * - vision: kamera kontrolü (GÖZLEM + ÖNERİ — bkz. gıda güvenliği)
 * - auto:   hazır olunca otomatik (geçiş düğümleri)
 */
export type CompletionType = 'user' | 'timer' | 'vision' | 'auto';

/**
 * Bir düğüme bağlı gıda güvenliği kısıtı (CLAUDE.md → GIDA GÜVENLİĞİ).
 * Motor `critical` bir düğümü ATLATMAZ; UI/ses katmanı `message`'ı göstermek
 * zorundadır.
 */
export interface SafetyRule {
  /** true ise adım atlanamaz. */
  critical: boolean;
  /** Kullanıcıya gösterilecek uyarı (çok dilli). */
  message: LocalizedText;
  /** Uygun olduğunda güvenli minimum iç sıcaklık (°C). */
  minInternalTempC?: number;
}

/**
 * Bir adıma özel kurtarma kuralları: kullanıcı niyeti → kurtarma cevabı (çok dilli).
 * Anahtarlar dil bağımsızdır (örn. "yaktim", "tuzlu").
 */
export type RecoveryRules = Record<string, LocalizedText>;

export interface RecipeNode {
  id: string;
  /** Listeler/başlıklar için kısa etiket (çok dilli). */
  title: LocalizedText;
  /** Tam yönerge; ekranda gösterilir ve TTS ile seslendirilir (çok dilli). */
  instruction: LocalizedText;
  kind: NodeKind;
  /** Bu düğümden önce `done`/`skipped` olması gereken düğüm id'leri. */
  requires: string[];
  /** Bilgilendirme amaçlı: aynı anda yürümesi beklenen düğümler. */
  parallel_with?: string[];
  completion: CompletionType;
  /** timer/active düğümler için geri sayım (saniye). */
  durationSec?: number;
  /** Düğüme girince söylenecek kısa, sıcak metin (çok dilli). */
  voice_on_enter?: LocalizedText;
  /** Düğüm tamamlanınca söylenecek metin (çok dilli). */
  voice_on_complete?: LocalizedText;
  /** Adıma özgü kurtarma kuralları. */
  recovery_rules?: RecoveryRules;
  /** Gıda güvenliği kısıtı. */
  safety?: SafetyRule;
}

export interface Recipe {
  id: string;
  /** Tarif adı (çok dilli). */
  title: LocalizedText;
  servings: number;
  /** İçeriğin kaynak BCP-47 yerel ayarı, örn. "tr". */
  locale: string;
  /** Tarif seçim ekranında gösterilen kısa tanıtım (çok dilli, opsiyonel). */
  summary?: LocalizedText;
  /** Tahmini süre (dakika), seçim ekranı için (opsiyonel). */
  totalMinutes?: number;
  nodes: RecipeNode[];
}
