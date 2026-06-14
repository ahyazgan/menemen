/**
 * Claude tabanlı tarif önerisi (tool use). Kullanıcının ifadesi + profil + aday
 * tarif özetlerini verir; Claude yalnızca verilen id'lerden birini seçer ve kısa
 * bir gerekçe yazar. Dönen id doğrulanır; geçersizse yerel sıralayıcıya düşülür.
 *
 * GÜVENLİK: Claude yeni tarif/adım uydurmaz — sadece onaylı adaylar arasından seçer.
 */
import type Anthropic from '@anthropic-ai/sdk';

import { localize } from '../../engine/localize';
import { bestRecipeId, isValidRecipeId } from '../../recipes/recommend';
import { recipeDiet } from '../../recipes/profile';
import { DEFAULT_CLAUDE_MODEL } from '../real/anthropicClient';
import type { RecommendInput, RecommendResult, RecommendService } from './types';

const SYSTEM =
  'Sen sıcak, samimi bir Türk mutfak asistanısın. Kullanıcının canının ne ' +
  'çektiğini ve profilini (diyet, sevmediği malzemeler, beceri) al; SADECE sana ' +
  'verilen aday tarifler arasından EN UYGUN olanı seç. Yeni tarif uydurma. ' +
  'pick_recipe aracıyla seçtiğin tarifin id\'sini ve tek cümlelik, sıcak bir ' +
  'gerekçe ver. Gerekçeyi kullanıcının dilinde yaz.';

interface PickToolInput {
  recipeId: string;
  reason: string;
}

export function createClaudeRecommend(
  client: Anthropic,
  model: string = DEFAULT_CLAUDE_MODEL,
): RecommendService {
  return {
    async suggest(input: RecommendInput): Promise<RecommendResult> {
      const { craving, locale, profile, candidates } = input;
      if (candidates.length === 0) return { recipeId: null };
      const ids = candidates.map((r) => r.id);

      try {
        const message = await client.messages.create({
          model,
          max_tokens: 256,
          system: SYSTEM,
          tools: [
            {
              name: 'pick_recipe',
              description: 'Aday tarifler arasından birini seç ve gerekçesini yaz.',
              input_schema: {
                type: 'object',
                properties: {
                  recipeId: { type: 'string', enum: ids },
                  reason: { type: 'string', description: 'Tek cümlelik sıcak gerekçe.' },
                },
                required: ['recipeId', 'reason'],
              },
            },
          ],
          tool_choice: { type: 'tool', name: 'pick_recipe' },
          messages: [{ role: 'user', content: buildUserContent(input) }],
        });

        const block = message.content.find((b) => b.type === 'tool_use');
        if (block && block.type === 'tool_use') {
          const picked = block.input as PickToolInput;
          if (isValidRecipeId(picked.recipeId, candidates)) {
            return { recipeId: picked.recipeId, reason: picked.reason };
          }
        }
      } catch {
        // ağ/AI hatası → sessizce yerel yedeğe düş
      }
      return { recipeId: bestRecipeId(craving, candidates, profile) };
    },
  };
}

function buildUserContent(input: RecommendInput): string {
  const { craving, locale, profile, candidates } = input;
  const lines = [`Kullanıcının canı şunu çekiyor: "${craving || '(belirtmedi)'}"`];
  lines.push(
    `Diyet: ${profile.diet}; beceri: ${profile.skill}; ` +
      `kaçındıkları: ${profile.avoid.join(', ') || 'yok'}.`,
  );
  lines.push('Aday tarifler:');
  for (const r of candidates) {
    const d = recipeDiet(r);
    const tag = d.vegan ? 'vegan' : d.vegetarian ? 'vejetaryen' : 'etli';
    const summary = r.summary ? localize(r.summary, locale) : '';
    lines.push(`- ${r.id}: ${localize(r.title, locale)} (${tag}). ${summary}`);
  }
  return lines.join('\n');
}
