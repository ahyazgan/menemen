/**
 * Mağaza puanı (in-app review) servisi. Interface arkasında — store yalnızca
 * bunu çağırır, native/Expo modülünü görmez (test için mock'lanabilir).
 */
export interface ReviewService {
  /** Cihazda yerel puan akışı kullanılabilir mi? */
  isAvailable(): Promise<boolean>;
  /** Yerel mağaza puan akışını aç (iOS SKStoreReview / Android In-App Review). */
  request(): Promise<void>;
}
