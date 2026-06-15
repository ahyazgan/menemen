/**
 * ProfileScreen — kişisel profil (CLAUDE.md değer #1'i güçlendirir: AI seni
 * tanısın). Diyet, beceri ve kaçınılan malzemeler. Sadece UI; mantık saf
 * (recipes/profile.ts), seçim profileStore'da kalıcı.
 */
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { allRecipes } from '../recipes';
import { allIngredients } from '../recipes/pantry';
import type { DietPref, SkillLevel } from '../recipes/profile';
import { useUiStore, useThemeColors } from '../state/uiStore';
import { useProfileStore } from '../state/profileStore';
import { localize } from '../engine';
import { t } from '../i18n';
import type { ThemeColors } from '../config/theme';

const DIETS: readonly DietPref[] = ['all', 'vegetarian', 'vegan'];
const SKILLS: readonly SkillLevel[] = ['beginner', 'intermediate', 'advanced'];

export function ProfileScreen({ onBack }: { onBack: () => void }) {
  const locale = useUiStore((s) => s.locale);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const profile = useProfileStore((s) => s.profile);
  const setDiet = useProfileStore((s) => s.setDiet);
  const setSkill = useProfileStore((s) => s.setSkill);
  const toggleAvoid = useProfileStore((s) => s.toggleAvoid);

  const ingredients = useMemo(() => allIngredients(allRecipes()), []);
  const avoidSet = useMemo(() => new Set(profile.avoid), [profile.avoid]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>{t('cooking.back')}</Text>
      </Pressable>
      <Text style={styles.title}>{t('profile.title')}</Text>
      <Text style={styles.subtitle}>{t('profile.subtitle')}</Text>

      <Text style={styles.section}>{t('profile.diet')}</Text>
      <View style={styles.row}>
        {DIETS.map((d) => (
          <Pressable
            key={d}
            style={[styles.pill, profile.diet === d && styles.pillOn]}
            onPress={() => void setDiet(d)}
          >
            <Text style={[styles.pillText, profile.diet === d && styles.pillTextOn]}>
              {t(`profile.diets.${d}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>{t('profile.skill')}</Text>
      <View style={styles.row}>
        {SKILLS.map((s) => (
          <Pressable
            key={s}
            style={[styles.pill, profile.skill === s && styles.pillOn]}
            onPress={() => void setSkill(s)}
          >
            <Text style={[styles.pillText, profile.skill === s && styles.pillTextOn]}>
              {t(`profile.skills.${s}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>{t('profile.avoid')}</Text>
      <Text style={styles.hint}>{t('profile.avoidHint')}</Text>
      <View style={styles.chips}>
        {ingredients.map((ing) => {
          const on = avoidSet.has(ing.key);
          return (
            <Pressable
              key={ing.key}
              style={[styles.chip, on && styles.chipOn]}
              onPress={() => void toggleAvoid(ing.key)}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>
                {localize(ing.name, locale)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.saved}>{t('profile.saved')}</Text>
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
    subtitle: { fontSize: 15, color: c.textMuted, marginTop: 6, marginBottom: 8, lineHeight: 21 },
    section: {
      fontSize: 13,
      fontWeight: '700',
      color: c.textMuted,
      marginTop: 18,
      marginBottom: 10,
    },
    hint: { fontSize: 13, color: c.textSubtle, marginTop: -4, marginBottom: 10, lineHeight: 19 },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    pill: {
      backgroundColor: c.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 18,
      paddingVertical: 10,
    },
    pillOn: { backgroundColor: c.primary, borderColor: c.primary },
    pillText: { color: c.textBody, fontSize: 14, fontWeight: '600' },
    pillTextOn: { color: c.onPrimary },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      backgroundColor: c.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    chipOn: { backgroundColor: c.warning, borderColor: c.warning },
    chipText: { color: c.textBody, fontSize: 14, fontWeight: '600' },
    chipTextOn: { color: '#FFFFFF' },
    saved: { fontSize: 14, color: c.successSoft, marginTop: 22, fontWeight: '600' },
  });
