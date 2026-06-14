/**
 * Paywall — abonelik planlarını gösterir ve satın alma/geri yükleme yapar.
 * Yalnızca subscriptionStore action'larını çağırır (UI katmanı).
 *
 * CLAUDE.md: ödeme yalnızca mağaza IAP üzerinden — burada harici ödeme YOK.
 */
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useSubscriptionStore } from '../state/subscriptionStore';
import { t } from '../i18n';

export function Paywall() {
  const { plans, loading, error, subscribed, init, purchase, restore } = useSubscriptionStore();

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

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('subscription.title')}</Text>
      <Text style={styles.subtitle}>{t('subscription.subtitle')}</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {loading && plans.length === 0 ? (
        <ActivityIndicator color="#B5300F" style={styles.loader} />
      ) : (
        plans.map((plan) => (
          <Pressable
            key={plan.id}
            style={styles.plan}
            disabled={loading}
            onPress={() => void purchase(plan.id)}
          >
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={styles.planDesc}>{plan.description}</Text>
            </View>
            <Text style={styles.planPrice}>{plan.priceLabel}</Text>
          </Pressable>
        ))
      )}

      <Pressable style={styles.restore} disabled={loading} onPress={() => void restore()}>
        <Text style={styles.restoreText}>{t('subscription.restore')}</Text>
      </Pressable>

      <Text style={styles.terms}>{t('subscription.terms')}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF8F0' },
  content: { padding: 24, paddingTop: 64 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF8F0' },
  done: { fontSize: 18, color: '#2E7D32', fontWeight: '600' },
  title: { fontSize: 30, fontWeight: '800', color: '#B5300F' },
  subtitle: { fontSize: 16, color: '#8A6D5B', marginTop: 8, marginBottom: 24 },
  error: { color: '#B5300F', marginBottom: 12 },
  loader: { marginVertical: 24 },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0E2D6',
  },
  planInfo: { flex: 1, paddingRight: 12 },
  planTitle: { fontSize: 17, fontWeight: '700', color: '#2B2B2B' },
  planDesc: { fontSize: 14, color: '#8A6D5B', marginTop: 2 },
  planPrice: { fontSize: 16, fontWeight: '700', color: '#B5300F' },
  restore: { marginTop: 12, alignItems: 'center', paddingVertical: 12 },
  restoreText: { color: '#8A6D5B', fontSize: 15, textDecorationLine: 'underline' },
  terms: { fontSize: 12, color: '#A8927F', marginTop: 16, textAlign: 'center' },
});
