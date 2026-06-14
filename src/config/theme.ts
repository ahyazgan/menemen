/**
 * Tema paletleri — açık (gündüz) ve karanlık (gece). Ekranlar renkleri buradan
 * semantik adlarla alır; böylece karanlık mod tek yerden yönetilir. Saf veri:
 * React/Expo importu yok, test edilebilir.
 */

export type ThemeName = 'light' | 'dark';

export interface ThemeColors {
  /** Ekran arka planı. */
  bg: string;
  /** Kart / yüzey arka planı. */
  surface: string;
  /** İkincil yüzey (malzeme paneli vb.). */
  surfaceAlt: string;
  /** Kenarlık. */
  border: string;
  /** Soft dolgu (atla/ekle gibi sakin butonlar). */
  fill: string;
  /** Marka rengi (başlık, aktif öğe). */
  primary: string;
  /** Marka üstü metin. */
  onPrimary: string;
  /** Koyu vurgulu buton (şansıma seç, mikrofon). */
  accent: string;
  /** Vurgu üstü metin. */
  onAccent: string;
  /** Ana metin. */
  text: string;
  /** Gövde metni. */
  textBody: string;
  /** Sönük metin (alt başlık, meta). */
  textMuted: string;
  /** En sönük metin (ipucu). */
  textSubtle: string;
  /** Placeholder. */
  placeholder: string;
  /** Başarı (yemek hazır). */
  success: string;
  /** Yumuşak başarı (tamamlanan adım, kiler eşleşmesi). */
  successSoft: string;
  /** Kart etiketi (ŞU AN). */
  label: string;
  /** Favori yıldız (dolu / boş). */
  star: string;
  starOff: string;
  /** Uyarı metni / arka planı / kenarlığı. */
  warning: string;
  warningBg: string;
  warningBorder: string;
}

const light: ThemeColors = {
  bg: '#FFF8F0',
  surface: '#FFFFFF',
  surfaceAlt: '#FFFDF9',
  border: '#F0E2D6',
  fill: '#F0E2D6',
  primary: '#B5300F',
  onPrimary: '#FFFFFF',
  accent: '#2B2B2B',
  onAccent: '#FFFFFF',
  text: '#2B2B2B',
  textBody: '#444444',
  textMuted: '#8A6D5B',
  textSubtle: '#A8927F',
  placeholder: '#A8927F',
  success: '#2E7D32',
  successSoft: '#6B8E5A',
  label: '#C77B4E',
  star: '#E0A100',
  starOff: '#C9B7A6',
  warning: '#9A6A00',
  warningBg: '#FFF1D6',
  warningBorder: '#E8C77A',
};

const dark: ThemeColors = {
  bg: '#16110D',
  surface: '#241C17',
  surfaceAlt: '#2A211B',
  border: '#3A2E26',
  fill: '#33271F',
  primary: '#FF7A4D',
  onPrimary: '#1A120C',
  accent: '#33271F',
  onAccent: '#F2E8E0',
  text: '#F2E8E0',
  textBody: '#D9CBBF',
  textMuted: '#C0A892',
  textSubtle: '#A08A78',
  placeholder: '#8A7563',
  success: '#7CB342',
  successSoft: '#9CCC65',
  label: '#E0935E',
  star: '#FFC83D',
  starOff: '#6B5648',
  warning: '#FFCA7A',
  warningBg: '#3A2E1A',
  warningBorder: '#6B5524',
};

export const THEMES: Record<ThemeName, ThemeColors> = { light, dark };
