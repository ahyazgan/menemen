import type Anthropic from '@anthropic-ai/sdk';

import type { VisionResult, VisionService } from '../types';
import { DEFAULT_CLAUDE_MODEL } from './anthropicClient';

/**
 * GIDA GÜVENLİĞİ (CLAUDE.md): asistan asla "kesinlikle pişti/yenebilir" demez.
 * Vision yalnızca tarafsız GÖZLEM + eyleme dönük ÖNERİ verir; şüphede "biraz daha
 * pişir" tarafına düşer. Bu kural sistem isteminde ve araç açıklamasında zorlanır.
 */
const SYSTEM =
  'Sen bir Türk mutfak asistanının görüş katmanısın. Tencere/tava fotoğrafına bak. ' +
  'KESİN HÜKÜM VERME: asla "pişti", "yenebilir", "hazır" deme. Yalnızca tarafsız bir ' +
  'GÖZLEM ve eyleme dönük bir ÖNERİ ver. Et/tavuk/balık/yumurtada şüphede "biraz daha ' +
  'pişir" tarafına düş ve mümkünse iç sıcaklık ölçümünü öner. report_observation aracını kullan.';

type MediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

interface VisionToolInput {
  observation: string;
  suggestion: string;
  confidence: number;
}

/**
 * Claude (tool use) ile tek kare kamera analizi — frame-on-demand.
 * `imageBase64`: ham base64 ya da "data:image/...;base64,..." biçimi olabilir.
 */
export function createClaudeVision(
  client: Anthropic,
  model: string = DEFAULT_CLAUDE_MODEL,
): VisionService {
  return {
    async analyze(imageBase64: string, prompt: string): Promise<VisionResult> {
      const { mediaType, data } = parseImage(imageBase64);
      const message = await client.messages.create({
        model,
        max_tokens: 512,
        system: SYSTEM,
        tools: [
          {
            name: 'report_observation',
            description:
              'Gözlem ve öneriyi bildir. Asla kesin pişti/yenebilir hükmü verme.',
            input_schema: {
              type: 'object',
              properties: {
                observation: { type: 'string', description: 'Tarafsız gözlem.' },
                suggestion: { type: 'string', description: 'Eyleme dönük öneri.' },
                confidence: { type: 'number', description: '0..1 görsel güven (kesinlik değil).' },
              },
              required: ['observation', 'suggestion', 'confidence'],
            },
          },
        ],
        tool_choice: { type: 'tool', name: 'report_observation' },
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data } },
              { type: 'text', text: prompt || 'Tencerenin durumunu yorumla.' },
            ],
          },
        ],
      });

      const block = message.content.find((b) => b.type === 'tool_use');
      if (!block || block.type !== 'tool_use') {
        return {
          observation: 'Görüntüyü net değerlendiremedim.',
          suggestion: 'Emin olmak için biraz daha pişirmeni öneririm.',
          confidence: 0,
        };
      }
      const input = block.input as VisionToolInput;
      return {
        observation: input.observation,
        suggestion: input.suggestion,
        confidence: input.confidence,
      };
    },
  };
}

/** "data:image/png;base64,XXXX" ya da ham base64'ü ayrıştırır. */
function parseImage(input: string): { mediaType: MediaType; data: string } {
  const match = /^data:(image\/(?:jpeg|png|gif|webp));base64,(.*)$/s.exec(input);
  if (match) {
    const [, mediaType, data] = match;
    if (mediaType && data !== undefined) {
      return { mediaType: mediaType as MediaType, data };
    }
  }
  return { mediaType: 'image/jpeg', data: input };
}
