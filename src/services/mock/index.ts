/** Tüm mock servisleri tek bir paket olarak kurar (UI'ı servissiz test et). */
import type { Services } from '../types';
import { createMockSTT } from './mockSTT';
import { createMockTTS } from './mockTTS';
import { createMockVision } from './mockVision';
import { createMockIntent } from './mockIntent';

export { createMockSTT, createMockTTS, createMockVision, createMockIntent };

export function createMockServices(): Services {
  return {
    stt: createMockSTT(),
    tts: createMockTTS(),
    vision: createMockVision(),
    intent: createMockIntent(),
  };
}
