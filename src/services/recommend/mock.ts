/**
 * Mock öneri servisi — UI'ı AI/ağ olmadan çalıştırmak ve gerçek servisin
 * çevrimdışı yedeği olmak için yerel sıralayıcıyı kullanır (saf recommend.ts).
 */
import { bestRecipeId } from '../../recipes/recommend';
import type { RecommendInput, RecommendResult, RecommendService } from './types';

export function createMockRecommend(): RecommendService {
  return {
    async suggest({ craving, profile, candidates }: RecommendInput): Promise<RecommendResult> {
      return { recipeId: bestRecipeId(craving, candidates, profile) };
    },
  };
}
