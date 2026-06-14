import type Anthropic from '@anthropic-ai/sdk';

import type { Intent, IntentContext, IntentKind, IntentService } from '../types';
import { DEFAULT_CLAUDE_MODEL } from './anthropicClient';

/** Tüm niyet türleri — araç şemasındaki enum için runtime listesi. */
const INTENT_KINDS: IntentKind[] = [
  'next',
  'repeat',
  'how_long',
  'what_now',
  'ingredients',
  'pause',
  'resume',
  'check',
  'recovery',
  'unknown',
];

const SYSTEM =
  'Sen bir Türk mutfak asistanının niyet ayrıştırıcısısın. Kullanıcının kısa, ' +
  'günlük konuşma dilindeki ifadesini al ve set_intent aracıyla yapılandır. ' +
  'Emin değilsen kind="unknown" ve düşük confidence ver. "yaktım", "çok tuzlu" ' +
  'gibi sorun ifadelerinde kind="recovery" ve uygun recoveryKey kullan.';

interface IntentToolInput {
  kind: IntentKind;
  recoveryKey?: string;
  confidence: number;
}

/** Claude (tool use) ile sesli ifadeyi yapılandırılmış niyete çevirir. */
export function createClaudeIntent(
  client: Anthropic,
  model: string = DEFAULT_CLAUDE_MODEL,
): IntentService {
  return {
    async parse(text: string, context: IntentContext): Promise<Intent> {
      const recoveryKeys = context.recoveryKeys ?? [];
      const message = await client.messages.create({
        model,
        max_tokens: 256,
        system: SYSTEM,
        tools: [
          {
            name: 'set_intent',
            description: 'Kullanıcının niyetini yapılandırılmış olarak bildir.',
            input_schema: {
              type: 'object',
              properties: {
                kind: { type: 'string', enum: INTENT_KINDS },
                recoveryKey: {
                  type: 'string',
                  enum: recoveryKeys.length > 0 ? recoveryKeys : ['none'],
                  description: 'Yalnızca kind="recovery" iken anlamlı.',
                },
                confidence: { type: 'number', description: '0..1 güven.' },
              },
              required: ['kind', 'confidence'],
            },
          },
        ],
        tool_choice: { type: 'tool', name: 'set_intent' },
        messages: [{ role: 'user', content: buildUserContent(text, context) }],
      });

      const block = message.content.find((b) => b.type === 'tool_use');
      if (!block || block.type !== 'tool_use') {
        return { kind: 'unknown', raw: text, confidence: 0 };
      }
      const input = block.input as IntentToolInput;
      const recoveryKey =
        input.recoveryKey && input.recoveryKey !== 'none' ? input.recoveryKey : undefined;
      return { kind: input.kind, raw: text, recoveryKey, confidence: input.confidence };
    },
  };
}

function buildUserContent(text: string, context: IntentContext): string {
  const lines = [`Kullanıcı dedi ki: "${text}"`];
  if (context.currentNodeId) lines.push(`Şu anki adım: ${context.currentNodeId}`);
  if (context.recoveryKeys?.length) {
    lines.push(`Bu adımda olası kurtarma anahtarları: ${context.recoveryKeys.join(', ')}`);
  }
  return lines.join('\n');
}
