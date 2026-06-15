/**
 * @sentry/react-native için minimal ambient bildirim. Paket henüz kurulu değil
 * (dinamik import ile çalışma zamanında yüklenir); bu bildirim tsc'yi tatmin
 * eder. `npx expo install @sentry/react-native` sonrası gerçek tipler geçerlidir.
 */
declare module '@sentry/react-native' {
  export function init(options: { dsn: string }): void;
  export function captureException(error: unknown): void;
}
