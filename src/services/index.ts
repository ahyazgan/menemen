/** Servis katmanı kamu API'si. */
export * from './types';
export { createMockServices } from './mock';
export { createRealServices, proxyRealConfig, type RealServiceConfig } from './real';
