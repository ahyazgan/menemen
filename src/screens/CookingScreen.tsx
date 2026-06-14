/**
 * CookingScreen — canlı pişirme ekranı (CLAUDE.md → screens: sadece UI, mantık
 * yok). Tüm iş cookingStore action'larından geçer; burada servis çağrısı YOK.
 */
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCookingStore } from '../state/cookingStore';
import { VoiceButton } from '../components/VoiceButton';
import { PotCheckButton } from '../components/PotCheckButton';
import { t } from '../i18n';
import type { Recipe } from '../engine/types';

interface Props {
  recipe: Recipe;
}

export function CookingScreen({ recipe }: Props) {
  const {
    engine,
    snapshot,
    currentNodeId,
    lastSpoken,
    safetyNotice,
    loadRecipe,
    completeNode,
    skipNode,
    retryNode,
    startNode,
    tick,
  } = useCookingStore();

  // Tarifi yükle ve pişirmeyi başlat.
  useEffect(() => {
    loadRecipe(recipe);
  }, [recipe, loadRecipe]);

  // Saniyede bir zamanlayıcıları ilerlet (süresi dolan timer'ları tamamlar).
  useEffect(() => {
    const handle = setInterval(tick, 1000);
    return () => clearInterval(handle);
  }, [tick]);

  if (!engine || !snapshot) return null;

  const current = currentNodeId ? engine.node(currentNodeId) : null;
  const remaining = currentNodeId ? engine.remainingSec(currentNodeId) : null;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{recipe.title}</Text>

      {/* İlerleme */}
      <Text style={styles.progress}>
        {t('cooking.progress')}: %{Math.round(snapshot.progress * 100)}
      </Text>

      {snapshot.complete ? (
        <Text style={styles.finished}>{t('cooking.finished')}</Text>
      ) : current ? (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t('cooking.active')}</Text>
          <Text style={styles.cardTitle}>{current.title}</Text>
          <Text style={styles.instruction}>{current.instruction}</Text>
          {remaining != null && (
            <Text style={styles.timer}>
              ⏱ {remaining} sn {t('cooking.remaining')}
            </Text>
          )}
          {current.safety && (
            <Text style={styles.safety}>⚠️ {current.safety.message}</Text>
          )}

          <View style={styles.row}>
            <Button label={t('cooking.complete')} onPress={() => void completeNode(current.id)} />
            <Button label={t('cooking.skip')} subtle onPress={() => void skipNode(current.id)} />
            <Button label={t('cooking.retry')} subtle onPress={() => retryNode(current.id)} />
          </View>
        </View>
      ) : (
        <Text style={styles.muted}>{t('cooking.nothingReady')}</Text>
      )}

      {safetyNotice && (
        <View style={styles.safetyBanner}>
          <Text style={styles.safetyBannerText}>⚠️ {safetyNotice}</Text>
        </View>
      )}

      {/* Hazır (paralel) adımlar */}
      {snapshot.ready.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('cooking.ready')}</Text>
          {snapshot.ready.map((id) => (
            <Pressable key={id} style={styles.readyItem} onPress={() => void startNode(id)}>
              <Text style={styles.readyText}>▶ {engine.node(id).title}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Tamamlananlar */}
      {snapshot.done.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('cooking.done')}</Text>
          {snapshot.done.map((id) => (
            <Text key={id} style={styles.doneItem}>
              ✓ {engine.node(id).title}
            </Text>
          ))}
        </View>
      )}

      {/* Ses (bas-konuş) ve frame-on-demand kamera kontrolleri */}
      <VoiceButton />
      <PotCheckButton />

      {lastSpoken && <Text style={styles.spoken}>“{lastSpoken}”</Text>}
    </ScrollView>
  );
}

function Button({
  label,
  onPress,
  subtle,
}: {
  label: string;
  onPress: () => void;
  subtle?: boolean;
}) {
  return (
    <Pressable style={[styles.btn, subtle && styles.btnSubtle]} onPress={onPress}>
      <Text style={[styles.btnText, subtle && styles.btnTextSubtle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF8F0' },
  content: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '700', color: '#B5300F', marginBottom: 4 },
  progress: { fontSize: 14, color: '#8A6D5B', marginBottom: 16 },
  finished: { fontSize: 22, fontWeight: '700', color: '#2E7D32', marginVertical: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: { fontSize: 12, color: '#C77B4E', fontWeight: '600', textTransform: 'uppercase' },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#2B2B2B', marginTop: 4 },
  instruction: { fontSize: 17, color: '#444', marginTop: 8, lineHeight: 24 },
  timer: { fontSize: 16, color: '#B5300F', marginTop: 12, fontWeight: '600' },
  safety: { fontSize: 14, color: '#9A6A00', marginTop: 12 },
  row: { flexDirection: 'row', gap: 10, marginTop: 18, flexWrap: 'wrap' },
  btn: { backgroundColor: '#B5300F', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  btnSubtle: { backgroundColor: '#F0E2D6' },
  btnText: { color: '#FFF', fontWeight: '600' },
  btnTextSubtle: { color: '#8A6D5B' },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#8A6D5B', marginBottom: 8 },
  readyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0E2D6',
  },
  readyText: { fontSize: 16, color: '#2B2B2B' },
  doneItem: { fontSize: 15, color: '#6B8E5A', marginBottom: 4 },
  muted: { fontSize: 16, color: '#8A6D5B', marginVertical: 16 },
  safetyBanner: {
    backgroundColor: '#FFF1D6',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E8C77A',
  },
  safetyBannerText: { color: '#9A6A00', fontSize: 14, fontWeight: '600' },
  mic: {
    marginTop: 28,
    backgroundColor: '#2B2B2B',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  micActive: { backgroundColor: '#B5300F' },
  micText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
  spoken: { marginTop: 14, fontStyle: 'italic', color: '#8A6D5B', textAlign: 'center' },
});
