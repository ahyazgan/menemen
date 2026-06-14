/**
 * RecipeListScreen — "Ne pişsem?" (CLAUDE.md değer #1: ne pişeceğine karar).
 * Sadece UI: tarif seçimini yukarı bildirir; pişirmeyi App yönlendirir.
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { recipeList, randomRecipe } from '../recipes';
import { t } from '../i18n';
import type { Recipe } from '../engine/types';

interface Props {
  onSelect: (recipe: Recipe) => void;
}

export function RecipeListScreen({ onSelect }: Props) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('picker.title')}</Text>
      <Text style={styles.subtitle}>{t('picker.subtitle')}</Text>

      <Pressable style={styles.random} onPress={() => onSelect(randomRecipe())}>
        <Text style={styles.randomText}>{t('picker.random')}</Text>
      </Pressable>

      {recipeList.map((recipe) => (
        <Pressable key={recipe.id} style={styles.card} onPress={() => onSelect(recipe)}>
          <Text style={styles.cardTitle}>{recipe.title}</Text>
          {recipe.summary && <Text style={styles.cardSummary}>{recipe.summary}</Text>}
          <Text style={styles.cardMeta}>
            {recipe.totalMinutes != null ? `${recipe.totalMinutes} ${t('picker.minutes')} · ` : ''}
            {recipe.servings} {t('picker.servings')}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF8F0' },
  content: { padding: 24, paddingTop: 56, paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: '800', color: '#B5300F' },
  subtitle: { fontSize: 16, color: '#8A6D5B', marginTop: 6, marginBottom: 20 },
  random: {
    backgroundColor: '#2B2B2B',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  randomText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0E2D6',
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#2B2B2B' },
  cardSummary: { fontSize: 15, color: '#6B5648', marginTop: 4, lineHeight: 21 },
  cardMeta: { fontSize: 13, color: '#A8927F', marginTop: 10 },
});
