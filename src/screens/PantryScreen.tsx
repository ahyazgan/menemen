/**
 * PantryScreen — "Elimde ne var?". Elindeki malzemeleri işaretle; yapabileceğin
 * tarifleri (eksiği en az olandan başlayarak) göster. Sadece UI; mantık saf
 * (recipes/pantry.ts), seçim pantryStore'da kalıcı.
 */
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { recipeList } from '../recipes';
import { allIngredients, rankByPantry } from '../recipes/pantry';
import { useUiStore } from '../state/uiStore';
import { usePantryStore } from '../state/pantryStore';
import { localize } from '../engine';
import { t } from '../i18n';
import type { Recipe } from '../engine/types';

interface Props {
  onSelect: (recipe: Recipe) => void;
  onBack: () => void;
}

export function PantryScreen({ onSelect, onBack }: Props) {
  const locale = useUiStore((s) => s.locale);
  const owned = usePantryStore((s) => s.owned);
  const toggle = usePantryStore((s) => s.toggle);

  const ingredients = useMemo(() => allIngredients(recipeList), []);
  const ownedSet = useMemo(() => new Set(owned), [owned]);
  const ranked = useMemo(() => rankByPantry(recipeList, ownedSet), [ownedSet]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>{t('cooking.back')}</Text>
      </Pressable>
      <Text style={styles.title}>{t('pantry.title')}</Text>
      <Text style={styles.subtitle}>{t('pantry.subtitle')}</Text>

      <Text style={styles.section}>{t('pantry.pickIngredients')}</Text>
      <View style={styles.chips}>
        {ingredients.map((ing) => {
          const on = ownedSet.has(ing.key);
          return (
            <Pressable
              key={ing.key}
              style={[styles.chip, on && styles.chipOn]}
              onPress={() => void toggle(ing.key)}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>
                {localize(ing.name, locale)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.section}>{t('pantry.canMake')}</Text>
      {ranked.length === 0 ? (
        <Text style={styles.empty}>{t('pantry.none')}</Text>
      ) : (
        ranked.map(({ recipe, have, total }) => (
          <Pressable key={recipe.id} style={styles.card} onPress={() => onSelect(recipe)}>
            <Text style={styles.cardTitle}>{localize(recipe.title, locale)}</Text>
            <Text style={[styles.cardMeta, have === total && styles.cardMetaFull]}>
              {have}/{total} {t('pantry.ofTotal')}
            </Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF8F0' },
  content: { padding: 24, paddingTop: 56, paddingBottom: 40 },
  back: { marginBottom: 8 },
  backText: { color: '#8A6D5B', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 30, fontWeight: '800', color: '#B5300F' },
  subtitle: { fontSize: 15, color: '#8A6D5B', marginTop: 6, marginBottom: 16, lineHeight: 21 },
  section: { fontSize: 13, fontWeight: '700', color: '#8A6D5B', marginTop: 12, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0E2D6',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipOn: { backgroundColor: '#6B8E5A', borderColor: '#6B8E5A' },
  chipText: { color: '#6B5648', fontSize: 14, fontWeight: '600' },
  chipTextOn: { color: '#FFF' },
  empty: { fontSize: 15, color: '#8A6D5B', marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0E2D6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#2B2B2B', flex: 1, paddingRight: 8 },
  cardMeta: { fontSize: 14, color: '#A8927F', fontWeight: '600' },
  cardMetaFull: { color: '#2E7D32' },
});
