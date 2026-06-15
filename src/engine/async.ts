/**
 * Asenkron yardımcılar (saf, test edilebilir). `withTimeout`, takılan bir söz
 * (ör. ağ üzerinden STT/Vision/AI çağrısı) uygulamayı süresiz dondurmasın diye
 * belirli sürede reddeder. Anahtarlar/gerçek servisler bağlanınca kritik.
 */
export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`İşlem ${ms}ms içinde tamamlanmadı`);
    this.name = 'TimeoutError';
  }
}

/**
 * `promise` verilen süre içinde çözülmezse TimeoutError ile reddeder. Söz
 * çözülürse zamanlayıcı temizlenir (sızıntı yok).
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new TimeoutError(ms)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}
