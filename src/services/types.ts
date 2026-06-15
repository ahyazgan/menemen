/**
 * Harici servis arayüzleri (CLAUDE.md → Mimari: services/ her zaman bir
 * interface arkasında, test için mock'lanabilir). screens bunları ASLA doğrudan
 * çağırmaz — state (cookingStore) üzerinden geçer.
 */

/** Konuşma → metin (örn. Deepgram). */
export interface STTService {
  /** Kaydedilmiş sesi metne çevirir. */
  transcribe(audioUri: string): Promise<string>;
}

/** Metin → konuşma (örn. ElevenLabs). */
export interface TTSService {
  /** Metni seslendirir; çalma bitince çözülür. */
  speak(text: string, opts?: { interrupt?: boolean }): Promise<void>;
  /** Süregelen konuşmayı kes. */
  stop(): Promise<void>;
}

/**
 * Niyet türleri — kullanıcının sesli/yazılı ifadesinin anlamı. Tanım motorda
 * (saf, testli; engine/intent.ts). Burada içe alınıp re-export edilir.
 */
import type { IntentKind } from '../engine/intent';
export type { IntentKind };

export interface Intent {
  kind: IntentKind;
  /** Ham metin, hata ayıklama/günlük için. */
  raw: string;
  /** recovery için yakalanan ipucu anahtarı (örn. "yaktim"). */
  recoveryKey?: string;
  /** 0..1 güven; düşükse store teyit isteyebilir. */
  confidence: number;
}

export interface IntentContext {
  /** Odaktaki düğüm id'si (varsa). */
  currentNodeId?: string;
  /** O düğümde tanımlı kurtarma anahtarları. */
  recoveryKeys?: string[];
}

/** Sesli ifadeyi yapılandırılmış niyete çeviren servis (örn. Claude Intent). */
export interface IntentService {
  parse(text: string, context: IntentContext): Promise<Intent>;
}

/**
 * Vision gözlemi (örn. Claude Vision). GIDA GÜVENLİĞİ: asla kesin hüküm
 * ("pişti/yenebilir") vermez — yalnızca gözlem + öneri.
 */
export interface VisionResult {
  /** Tarafsız gözlem, örn. "Kenarları altın rengi, ortası hâlâ akışkan." */
  observation: string;
  /** Eyleme dönük öneri, örn. "Biraz daha pişirmeni öneririm." */
  suggestion: string;
  /** 0..1 görsel güven (kesinlik DEĞİL). */
  confidence: number;
}

/** Tek kare kamera analizi — frame-on-demand (CLAUDE.md → sürekli akış YOK). */
export interface VisionService {
  analyze(imageUri: string, prompt: string): Promise<VisionResult>;
}

/** Tüm servislerin bir arada enjekte edildiği paket. */
export interface Services {
  stt: STTService;
  tts: TTSService;
  intent: IntentService;
  vision: VisionService;
}
