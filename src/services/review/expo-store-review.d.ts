/**
 * expo-store-review için minimal ambient bildirim. Paket henüz kurulu değil
 * (dinamik import ile çalışma zamanında yüklenir); bu bildirim tsc'yi tatmin
 * eder. `npx expo install expo-store-review` sonrası gerçek tipler devreye girer.
 */
declare module 'expo-store-review' {
  export function isAvailableAsync(): Promise<boolean>;
  export function requestReview(): Promise<void>;
}
