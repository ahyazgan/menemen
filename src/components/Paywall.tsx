/**
 * Paywall — abonelik planlarını gösterir ve satın alma/geri yükleme yapar.
 * Yalnızca subscriptionStore action'larını çağırır (UI katmanı).
 *
 * A/B: aktif varyant (flagsStore → remote config) metni ve deneme rozetini
 * belirler (saf paywallSpec). Dönüşüm paywall_view + subscribed (her ikisi de
 * varyantla) ile ölçülür.
 *
 * CLAUDE.md: ödeme yalnızca mağaza IAP üzerinden — burada harici ödeme YOK.
 */
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useSubscriptionStore } from '../state/subscriptionStore';
import { useFlag } from '../state/flagsStore';
import { useThemeColors } from '../state/uiStore';
import { paywallSpec } from '../recipes/paywall';
import { t } from '../i18n';
import type { ThemeColors } from '../config/theme';

export function Paywall() {
  const { plans, loading, error, subscribed, init, purchase, restore } = useSubscriptionStore();
  const variant = useFlag('paywallVariant');
  const spec = useMemo(() => paywallSpec(variant), [variant]);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  useEffect(() => {
    void init();
  }, [init]);

  if (subscribed) {
    return (
      <View style={styles.center}>
        <Text style={styles.done}>{t('subscription.subscribed')}</Text>
      </View>
    );
  }

  // Varyant metin kümesi (eksikse control'a düşer — t() anahtarı döndürmez).
  const titleKey = `subscription.variants.${spec.copyKey}.title`;
  const subtitleKey = `subscription.variants.${spec.copyKey}.subtitle`;
  const ctaKey = `subscription.variants.${spec.copyKey}.cta`;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {spec.trialDays > 0 && (
        <View style={styles.trialBadge}>
          <Text style={styles.trialText}>
            {t('subscription.trialBadge', { days: spec.trialDays })}
          </Text>
        </View>
      )}
      <Text style={styles.title}>{t(titleKey)}</Text>
      <Text style={styles.subtitle}>{t(subtitleKey)}</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {loading && plans.length === 0 ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : (
        plans.map((plan) => (
          <Pressable
            key={plan.id}
            style={styles.plan}
            disabled={loading}
            onPress={() => void purchase(plan.id)}
            accessibilityRole="button"
            accessibilityLabel={`${plan.title} · ${plan.priceLabel}`}
          >
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={styles.planDesc}>{plan.description}</Text>
            </View>
            <Text style={styles.planPrice}>{plan.priceLabel}</Text>
          </Pressable>
        ))
      )}

      {plans.length > 0 && <Text style={styles.cta}>{t(ctaKey)}</Text>}

      <Pressable style={styles.restore} disabled={loading} onPress={() => void restore()}>
        <Text style={styles.restoreText}>{t('subscription.restore')}</Text>
      </Pressable>

      <Text style={styles.terms}>{t('subscription.terms')}</Text>
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    content: { padding: 24, paddingTop: 64 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg },
    done: { fontSize: 18, color: c.success, fontWeight: '600' },
    trialBadge: {
      alignSelf: 'flex-start',
      backgroundColor: c.accent,
      borderRadius: 999,
      paddingVertical: 6,
      paddingHorizontal: 14,
      marginBottom: 12,
    },
    trialText: { color: c.onAccent, fontSize: 14, fontWeight: '800' },
    title: { fontSize: 30, fontWeight: '800', color: c.primary },
    subtitle: { fontSize: 16, color: c.textMuted, marginTop: 8, marginBottom: 24, lineHeight: 23 },
    error: { color: c.primary, marginBottom: 12 },
    loader: { marginVertical: 24 },
    plan: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.surface,
      borderRadius: 14,
      padding: 18,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: c.border,
    },
    planInfo: { flex: 1, paddingRight: 12 },
    planTitle: { fontSize: 17, fontWeight: '700', color: c.text },
    planDesc: { fontSize: 14, color: c.textMuted, marginTop: 2 },
    planPrice: { fontSize: 16, fontWeight: '700', color: c.primary },
    cta: { fontSize: 14, color: c.textSubtle, textAlign: 'center', marginTop: 4 },
    restore: { marginTop: 12, alignItems: 'center', paddingVertical: 12 },
    restoreText: { color: c.textMuted, fontSize: 15, textDecorationLine: 'underline' },
    terms: {
      fontSize: 12,
      color: c.textSubtle,
      marginTop: 16,
      textAlign: 'center',
      lineHeight: 18,
    },
  });
