/**
 * RecipeListScreen — "Ne pişsem?" (CLAUDE.md değer #1: ne pişeceğine karar).
 * Arama + kategori filtresi. Sadece UI: seçim yukarı bildirilir; filtre saf
 * (filterRecipes), pişirmeyi App yönlendirir.
 */
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { recipeList, randomRecipe } from '../recipes';
import { CATEGORIES, filterRecipes } from '../recipes/filter';
import { getLocale, t } from '../i18n';
import { localize } from '../engine';
import type { Recipe, RecipeCategory } from '../engine/types';

interface Props {
  onSelect: (recipe: Recipe) => void;
}

export function RecipeListScreen({ onSelect }: Props) {
  const locale = getLocale();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<RecipeCategory | null>(null);

  const shown = useMemo(() => filterRecipes(recipeList, { query, category }), [query, category]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('picker.title')}</Text>
      <Text style={styles.subtitle}>{t('picker.subtitle')}</Text>

      <TextInput
        style={styles.search}
        placeholder={t('picker.search')}
        placeholderTextColor="#A8927F"
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      {/* Kategori sekmeleri */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        <Chip label={t('picker.all')} active={category === null} onPress={() => setCategory(null)} />
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={t(`picker.categories.${c}`)}
            active={category === c}
            onPress={() => setCategory((prev) => (prev === c ? null : c))}
          />
        ))}
      </ScrollView>

      <Pressable style={styles.random} onPress={() => onSelect(randomRecipe())}>
        <Text style={styles.randomText}>{t('picker.random')}</Text>
      </Pressable>

      {shown.length === 0 ? (
        <Text style={styles.empty}>{t('picker.noResults')}</Text>
      ) : (
        shown.map((recipe) => (
          <Pressable key={recipe.id} style={styles.card} onPress={() => onSelect(recipe)}>
            <Text style={styles.cardTitle}>{localize(recipe.title, locale)}</Text>
            {recipe.summary && (
              <Text style={styles.cardSummary}>{localize(recipe.summary, locale)}</Text>
            )}
            <Text style={styles.cardMeta}>
              {recipe.totalMinutes != null ? `${recipe.totalMinutes} ${t('picker.minutes')} · ` : ''}
              {recipe.servings} {t('picker.servings')}
            </Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF8F0' },
  content: { padding: 24, paddingTop: 56, paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: '800', color: '#B5300F' },
  subtitle: { fontSize: 16, color: '#8A6D5B', marginTop: 6, marginBottom: 16 },
  search: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E2D6',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2B2B2B',
  },
  chips: { marginTop: 12, marginBottom: 4 },
  chip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0E2D6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#B5300F', borderColor: '#B5300F' },
  chipText: { color: '#8A6D5B', fontSize: 14, fontWeight: '600' },
  chipTextActive: { color: '#FFF' },
  random: {
    backgroundColor: '#2B2B2B',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  randomText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  empty: { fontSize: 16, color: '#8A6D5B', textAlign: 'center', marginTop: 24 },
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
