/**
 * OnboardingScreen — ilk açılış akışı (3 adım): karşılama/değer önerisi → hızlı
 * diyet seçimi → izin gerekçeleri. CLAUDE.md: izinler net ve dürüst; kamera
 * sürekli açık değil. Sadece UI; diyet profileStore'a, "görüldü" onboardingStore'a.
 */
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { DietPref } from '../recipes/profile';
import { useThemeColors } from '../state/uiStore';
import { useProfileStore } from '../state/profileStore';
import { useOnboardingStore } from '../state/onboardingStore';
import { t } from '../i18n';
import type { ThemeColors } from '../config/theme';

const DIETS: readonly DietPref[] = ['all', 'vegetarian', 'vegan'];

export function OnboardingScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const diet = useProfileStore((s) => s.profile.diet);
  const setDiet = useProfileStore((s) => s.setDiet);
  const complete = useOnboardingStore((s) => s.complete);
  const [step, setStep] = useState(0);

  const last = 2;
  function next(): void {
    if (step >= last) void complete();
    else setStep((s) => s + 1);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.body}>
        {step === 0 && (
          <>
            <Text style={styles.emoji}>👩‍🍳</Text>
            <Text style={styles.title}>{t('onboarding.welcomeTitle')}</Text>
            <Text style={styles.text}>{t('onboarding.welcomeBody')}</Text>
          </>
        )}

        {step === 1 && (
          <>
            <Text style={styles.title}>{t('onboarding.dietTitle')}</Text>
            <Text style={styles.text}>{t('onboarding.dietBody')}</Text>
            <View style={styles.diets}>
              {DIETS.map((d) => (
                <Pressable
                  key={d}
                  style={[styles.pill, diet === d && styles.pillOn]}
                  onPress={() => void setDiet(d)}
                >
                  <Text style={[styles.pillText, diet === d && styles.pillTextOn]}>
                    {t(`profile.diets.${d}`)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>{t('onboarding.permsTitle')}</Text>
            <Text style={styles.perm}>{t('onboarding.permMic')}</Text>
            <Text style={styles.perm}>{t('onboarding.permCamera')}</Text>
            <Text style={styles.perm}>{t('onboarding.permNotif')}</Text>
            <Text style={styles.permFooter}>{t('onboarding.permsFooter')}</Text>
          </>
        )}
      </View>

      <Pressable style={styles.primary} onPress={next}>
        <Text style={styles.primaryText}>
          {step >= last ? t('onboarding.start') : t('onboarding.next')}
        </Text>
      </Pressable>
      {step < last && (
        <Pressable style={styles.skip} onPress={() => setStep(last)}>
          <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    content: { padding: 28, paddingTop: 72, paddingBottom: 40, flexGrow: 1 },
    dots: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 32 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: c.border },
    dotActive: { backgroundColor: c.primary, width: 22 },
    body: { flex: 1 },
    emoji: { fontSize: 56, textAlign: 'center', marginBottom: 16 },
    title: { fontSize: 28, fontWeight: '800', color: c.primary, marginBottom: 14, lineHeight: 34 },
    text: { fontSize: 17, color: c.textBody, lineHeight: 25 },
    diets: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 24 },
    pill: {
      backgroundColor: c.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 22,
      paddingVertical: 12,
    },
    pillOn: { backgroundColor: c.primary, borderColor: c.primary },
    pillText: { color: c.textBody, fontSize: 15, fontWeight: '700' },
    pillTextOn: { color: c.onPrimary },
    perm: { fontSize: 16, color: c.textBody, lineHeight: 24, marginBottom: 14 },
    permFooter: {
      fontSize: 14,
      color: c.textSubtle,
      marginTop: 6,
      lineHeight: 20,
      fontStyle: 'italic',
    },
    primary: {
      backgroundColor: c.primary,
      borderRadius: 16,
      paddingVertical: 17,
      alignItems: 'center',
      marginTop: 24,
    },
    primaryText: { color: c.onPrimary, fontSize: 17, fontWeight: '800' },
    skip: { paddingVertical: 12, alignItems: 'center', marginTop: 4 },
    skipText: { color: c.textMuted, fontSize: 15, fontWeight: '600' },
  });
