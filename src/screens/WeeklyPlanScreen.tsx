/**
 * WeeklyPlanScreen — haftalık menü planı (CLAUDE.md değer #1: ne pişeceğine karar
 * + planlama). Profile göre plan üret, günü değiştir, tüm malzemeleri alışveriş
 * listesine aktar. Sadece UI; plan mantığı saf (recipes/mealPlan.ts).
 */
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { recipeList, getRecipe } from '../recipes';
import { planIngredients } from '../recipes/mealPlan';
import { recipeDifficulty } from '../recipes/profile';
import { useUiStore, useThemeColors } from '../state/uiStore';
import { useProfileStore } from '../state/profileStore';
import { useMealPlanStore } from '../state/mealPlanStore';
import { useShoppingStore } from '../state/shoppingStore';
import { localize } from '../engine';
import { t } from '../i18n';
import type { ThemeColors } from '../config/theme';
import type { Recipe } from '../engine/types';

interface Props {
  onSelect: (recipe: Recipe) => void;
  onBack: () => void;
}

export function WeeklyPlanScreen({ onSelect, onBack }: Props) {
  const locale = useUiStore((s) => s.locale);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const profile = useProfileStore((s) => s.profile);
  const plan = useMealPlanStore((s) => s.plan);
  const generate = useMealPlanStore((s) => s.generate);
  const swap = useMealPlanStore((s) => s.swap);
  const clear = useMealPlanStore((s) => s.clear);
  const addToShopping = useShoppingStore((s) => s.add);
  const [added, setAdded] = useState(false);

  function onAddAll(): void {
    const items = planIngredients(plan, recipeList, locale);
    void addToShopping(items);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>{t('cooking.back')}</Text>
      </Pressable>
      <Text style={styles.title}>{t('plan.title')}</Text>
      <Text style={styles.subtitle}>{t('plan.subtitle')}</Text>

      <Pressable style={styles.generate} onPress={() => void generate(profile)}>
        <Text style={styles.generateText}>
          {plan.length === 0 ? t('plan.generate') : t('plan.regenerate')}
        </Text>
      </Pressable>

      {plan.length === 0 ? (
        <Text style={styles.empty}>{t('plan.empty')}</Text>
      ) : (
        <>
          {plan.map((id, day) => {
            const recipe = getRecipe(id);
            if (!recipe) return null;
            return (
              <View key={`${day}-${id}`} style={styles.dayRow}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>{day + 1}</Text>
                </View>
                <Pressable style={styles.dayCard} onPress={() => onSelect(recipe)}>
                  <Text style={styles.dayLabel}>
                    {t('plan.day')} {day + 1}
                  </Text>
                  <Text style={styles.dayTitle}>{localize(recipe.title, locale)}</Text>
                  <Text style={styles.dayMeta}>
                    {recipe.totalMinutes != null
                      ? `${recipe.totalMinutes} ${t('picker.minutes')} · `
                      : ''}
                    {t(`difficulty.${recipeDifficulty(recipe)}`)}
                  </Text>
                </Pressable>
                <Pressable style={styles.swap} onPress={() => void swap(profile, day)}>
                  <Text style={styles.swapText}>{t('plan.swap')}</Text>
                </Pressable>
              </View>
            );
          })}

          <Pressable style={styles.addAll} onPress={onAddAll}>
            <Text style={styles.addAllText}>{added ? t('plan.added') : t('plan.addAll')}</Text>
          </Pressable>
          <Pressable style={styles.clear} onPress={() => void clear()}>
            <Text style={styles.clearText}>{t('plan.clear')}</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    content: { padding: 24, paddingTop: 56, paddingBottom: 40 },
    back: { marginBottom: 8 },
    backText: { color: c.textMuted, fontSize: 16, fontWeight: '600' },
    title: { fontSize: 30, fontWeight: '800', color: c.primary },
    subtitle: { fontSize: 15, color: c.textMuted, marginTop: 6, marginBottom: 16, lineHeight: 21 },
    generate: {
      backgroundColor: c.primary,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      marginBottom: 18,
    },
    generateText: { color: c.onPrimary, fontSize: 16, fontWeight: '800' },
    empty: { fontSize: 16, color: c.textMuted, marginTop: 8, lineHeight: 22 },
    dayRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    dayBadge: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: c.fill,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    dayBadgeText: { color: c.primary, fontSize: 14, fontWeight: '800' },
    dayCard: {
      flex: 1,
      backgroundColor: c.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      padding: 14,
    },
    dayLabel: { fontSize: 11, color: c.textSubtle, fontWeight: '700', textTransform: 'uppercase' },
    dayTitle: { fontSize: 17, fontWeight: '700', color: c.text, marginTop: 2 },
    dayMeta: { fontSize: 12, color: c.textSubtle, marginTop: 4 },
    swap: {
      marginLeft: 8,
      backgroundColor: c.fill,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    swapText: { color: c.textMuted, fontSize: 13, fontWeight: '700' },
    addAll: {
      backgroundColor: c.accent,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 16,
    },
    addAllText: { color: c.onAccent, fontSize: 15, fontWeight: '700' },
    clear: { paddingVertical: 12, alignItems: 'center', marginTop: 4 },
    clearText: { color: c.textMuted, fontSize: 14, fontWeight: '600' },
  });
