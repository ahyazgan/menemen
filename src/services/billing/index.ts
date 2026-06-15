/** Abonelik (billing) kamu API'si. */
export * from './types';
export { createMockBilling } from './mock';
// NOT: createRevenueCatBilling bilerek barrel'dan re-export EDİLMEZ. revenuecat.ts
// 'react-native-purchases' (native modül; Expo Go'da YOK) import eder; barrel'dan
// yayılırsa uygulama açılışta Expo Go'da çöker. Gerçek billing için doğrudan
// './services/billing/revenuecat' yolundan import et.
export type { RevenueCatConfig } from './revenuecat';
