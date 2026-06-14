/**
 * CookingScreen — canlı pişirme ekranı (CLAUDE.md → screens: sadece UI, mantık
 * yok). Tüm iş cookingStore action'larından geçer; burada servis çağrısı YOK.
 */
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useCookingStore } from '../state/cookingStore';
import { useUiStore, useThemeColors } from '../state/uiStore';
import { useShoppingStore } from '../state/shoppingStore';
import { useHistoryStore } from '../state/historyStore';
import { useNotesStore } from '../state/notesStore';
import { useStepPhotosStore } from '../state/stepPhotosStore';
import { useProfileStore } from '../state/profileStore';
import { useShareStore } from '../state/shareStore';
import { getStepPhoto } from '../recipes/stepPhotos';
import { guidance } from '../recipes/skill';
import { recipeDeepLink, buildShareText } from '../recipes/share';
import { VoiceButton } from '../components/VoiceButton';
import { PotCheckButton } from '../components/PotCheckButton';
import { ingredientLabel } from '../recipes/ingredients';
import type { ShoppingItem } from '../recipes/shopping';
import { t } from '../i18n';
import { localize } from '../engine';
import type { ThemeColors } from '../config/theme';
import type { Recipe } from '../engine/types';

interface Props {
  recipe: Recipe;
  /** Tarif listesine dönüş (opsiyonel). */
  onBack?: () => void;
}

export function CookingScreen({ recipe, onBack }: Props) {
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
  const locale = useUiStore((s) => s.locale);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const addToShopping = useShoppingStore((s) => s.add);
  const recordHistory = useHistoryStore((s) => s.record);
  const note = useNotesStore((s) => s.notes[recipe.id] ?? '');
  const setNote = useNotesStore((s) => s.setNote);
  const photoMap = useStepPhotosStore((s) => s.map);
  const capturePhoto = useStepPhotosStore((s) => s.capture);
  const removePhoto = useStepPhotosStore((s) => s.remove);
  const skill = useProfileStore((s) => s.profile.skill);
  const guide = guidance(skill);
  const share = useShareStore((s) => s.share);
  const [servings, setServings] = useState(recipe.servings);

  function onShare(): void {
    const text = buildShareText(
      t('cooking.shareText'),
      localize(recipe.title, locale),
      recipeDeepLink(recipe.id),
    );
    void share(text);
  }
  const [added, setAdded] = useState(false);
  const complete = snapshot?.complete ?? false;

  // Tarif tamamlanınca pişirme geçmişine kaydet (bir kez).
  useEffect(() => {
    if (complete) void recordHistory(recipe.id);
  }, [complete, recipe.id, recordHistory]);

  function onAddToShopping(): void {
    if (!recipe.ingredients) return;
    const items: ShoppingItem[] = recipe.ingredients.map((ing, idx) => ({
      id: `${recipe.id}:${idx}`,
      label: ingredientLabel(ing, recipe.servings, servings, locale),
      checked: false,
    }));
    void addToShopping(items);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

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
      {onBack && (
        <Pressable onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>{t('cooking.back')}</Text>
        </Pressable>
      )}
      <Text style={styles.title}>{localize(recipe.title, locale)}</Text>

      {/* İlerleme (beceriye göre adım sayacı) */}
      <Text style={styles.progress}>
        {t('cooking.progress')}: %{Math.round(snapshot.progress * 100)}
        {guide.stepNumbers
          ? ` · ${t('cooking.step')} ${snapshot.done.length}/${recipe.nodes.length}`
          : ''}
      </Text>
      {guide.verbose && !snapshot.complete && (
        <Text style={styles.beginnerHint}>{t('cooking.beginnerHint')}</Text>
      )}

      {/* Malzemeler + porsiyon ayarı */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <View style={styles.ingPanel}>
          <View style={styles.ingHeader}>
            <Text style={styles.ingTitle}>{t('cooking.ingredients')}</Text>
            <View style={styles.stepper}>
              <Pressable
                style={styles.stepBtn}
                onPress={() => setServings((s) => Math.max(1, s - 1))}
              >
                <Text style={styles.stepText}>−</Text>
              </Pressable>
              <Text style={styles.servings}>
                {servings} {t('picker.servings')}
              </Text>
              <Pressable style={styles.stepBtn} onPress={() => setServings((s) => s + 1)}>
                <Text style={styles.stepText}>+</Text>
              </Pressable>
            </View>
          </View>
          {recipe.ingredients.map((ing, idx) => (
            <Text key={idx} style={styles.ingItem}>
              • {ingredientLabel(ing, recipe.servings, servings, locale)}
            </Text>
          ))}
          <Pressable style={styles.addBtn} onPress={onAddToShopping}>
            <Text style={styles.addText}>
              {added ? t('cooking.added') : t('cooking.addToShopping')}
            </Text>
          </Pressable>
        </View>
      )}

      {snapshot.complete ? (
        <View>
          <Text style={styles.finished}>{t('cooking.finished')}</Text>
          <Pressable style={styles.share} onPress={onShare}>
            <Text style={styles.shareText}>{t('cooking.share')}</Text>
          </Pressable>
        </View>
      ) : current ? (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t('cooking.active')}</Text>
          <Text style={styles.cardTitle}>{localize(current.title, locale)}</Text>
          <Text style={styles.instruction}>{localize(current.instruction, locale)}</Text>
          {remaining != null && (
            <Text style={styles.timer}>
              ⏱ {remaining} sn {t('cooking.remaining')}
            </Text>
          )}
          {current.safety && (
            <Text style={styles.safety}>⚠️ {localize(current.safety.message, locale)}</Text>
          )}

          <View style={styles.row}>
            <Button
              label={t('cooking.complete')}
              onPress={() => void completeNode(current.id)}
              styles={styles}
            />
            <Button
              label={t('cooking.skip')}
              subtle
              onPress={() => void skipNode(current.id)}
              styles={styles}
            />
            <Button
              label={t('cooking.retry')}
              subtle
              onPress={() => retryNode(current.id)}
              styles={styles}
            />
          </View>

          {/* Adım fotoğrafı (frame-on-demand, isteğe bağlı) */}
          {(() => {
            const uri = getStepPhoto(photoMap, recipe.id, current.id);
            return uri ? (
              <View style={styles.photoBlock}>
                <Image source={{ uri }} style={styles.photo} resizeMode="cover" />
                <View style={styles.photoActions}>
                  <Pressable onPress={() => void capturePhoto(recipe.id, current.id)}>
                    <Text style={styles.photoLink}>{t('cooking.retakePhoto')}</Text>
                  </Pressable>
                  <Pressable onPress={() => void removePhoto(recipe.id, current.id)}>
                    <Text style={styles.photoRemove}>{t('cooking.removePhoto')}</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                style={styles.photoBtn}
                onPress={() => void capturePhoto(recipe.id, current.id)}
              >
                <Text style={styles.photoBtnText}>{t('cooking.addPhoto')}</Text>
              </Pressable>
            );
          })()}
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
              <Text style={styles.readyText}>▶ {localize(engine.node(id).title, locale)}</Text>
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
              ✓ {localize(engine.node(id).title, locale)}
            </Text>
          ))}
        </View>
      )}

      {/* Ses (bas-konuş) ve frame-on-demand kamera kontrolleri */}
      <VoiceButton />
      <PotCheckButton />

      {lastSpoken && <Text style={styles.spoken}>“{lastSpoken}”</Text>}

      {/* Kişisel notlar (kalıcı) */}
      <View style={styles.notesBlock}>
        <Text style={styles.notesLabel}>{t('cooking.notes')}</Text>
        <TextInput
          style={styles.notesInput}
          placeholder={t('cooking.notesPlaceholder')}
          placeholderTextColor={colors.placeholder}
          value={note}
          onChangeText={(text) => void setNote(recipe.id, text)}
          multiline
        />
      </View>

      {/* Kalıcı gıda güvenliği hatırlatması (CLAUDE.md → kesin hüküm yok). */}
      <Text style={styles.safetyFooter}>{t('safety.general')}</Text>
    </ScrollView>
  );
}

function Button({
  label,
  onPress,
  subtle,
  styles,
}: {
  label: string;
  onPress: () => void;
  subtle?: boolean;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <Pressable style={[styles.btn, subtle && styles.btnSubtle]} onPress={onPress}>
      <Text style={[styles.btnText, subtle && styles.btnTextSubtle]}>{label}</Text>
    </Pressable>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    content: { padding: 20, paddingBottom: 48 },
    back: { marginBottom: 8 },
    backText: { color: c.textMuted, fontSize: 16, fontWeight: '600' },
    title: { fontSize: 28, fontWeight: '700', color: c.primary, marginBottom: 4 },
    progress: { fontSize: 14, color: c.textMuted, marginBottom: 16 },
    beginnerHint: {
      fontSize: 14,
      color: c.label,
      marginTop: -8,
      marginBottom: 16,
      fontStyle: 'italic',
      lineHeight: 20,
    },
    ingPanel: {
      backgroundColor: c.surfaceAlt,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      marginBottom: 16,
    },
    ingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    ingTitle: { fontSize: 16, fontWeight: '700', color: c.textMuted },
    stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    stepBtn: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: c.fill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepText: { fontSize: 18, color: c.primary, fontWeight: '700' },
    servings: { fontSize: 14, color: c.text, fontWeight: '600', minWidth: 64, textAlign: 'center' },
    ingItem: { fontSize: 15, color: c.textBody, lineHeight: 24 },
    addBtn: {
      marginTop: 12,
      backgroundColor: c.fill,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
    },
    addText: { color: c.textMuted, fontSize: 15, fontWeight: '700' },
    finished: {
      fontSize: 22,
      fontWeight: '700',
      color: c.success,
      marginTop: 24,
      marginBottom: 14,
    },
    share: {
      backgroundColor: c.primary,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      marginBottom: 24,
    },
    shareText: { color: c.onPrimary, fontSize: 16, fontWeight: '800' },
    card: {
      backgroundColor: c.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    cardLabel: { fontSize: 12, color: c.label, fontWeight: '600', textTransform: 'uppercase' },
    cardTitle: { fontSize: 22, fontWeight: '700', color: c.text, marginTop: 4 },
    instruction: { fontSize: 17, color: c.textBody, marginTop: 8, lineHeight: 24 },
    timer: { fontSize: 16, color: c.primary, marginTop: 12, fontWeight: '600' },
    safety: { fontSize: 14, color: c.warning, marginTop: 12 },
    row: { flexDirection: 'row', gap: 10, marginTop: 18, flexWrap: 'wrap' },
    btn: {
      backgroundColor: c.primary,
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 12,
    },
    btnSubtle: { backgroundColor: c.fill },
    btnText: { color: c.onPrimary, fontWeight: '600' },
    btnTextSubtle: { color: c.textMuted },
    photoBtn: {
      marginTop: 14,
      backgroundColor: c.fill,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
    },
    photoBtnText: { color: c.textMuted, fontSize: 15, fontWeight: '700' },
    photoBlock: { marginTop: 14 },
    photo: { width: '100%', height: 180, borderRadius: 12, backgroundColor: c.fill },
    photoActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    photoLink: { color: c.primary, fontSize: 14, fontWeight: '600' },
    photoRemove: { color: c.textSubtle, fontSize: 14, fontWeight: '600' },
    section: { marginTop: 24 },
    sectionTitle: { fontSize: 13, fontWeight: '700', color: c.textMuted, marginBottom: 8 },
    readyItem: {
      backgroundColor: c.surface,
      borderRadius: 10,
      padding: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: c.border,
    },
    readyText: { fontSize: 16, color: c.text },
    doneItem: { fontSize: 15, color: c.successSoft, marginBottom: 4 },
    muted: { fontSize: 16, color: c.textMuted, marginVertical: 16 },
    safetyBanner: {
      backgroundColor: c.warningBg,
      borderRadius: 12,
      padding: 14,
      marginTop: 16,
      borderWidth: 1,
      borderColor: c.warningBorder,
    },
    safetyBannerText: { color: c.warning, fontSize: 14, fontWeight: '600' },
    spoken: { marginTop: 14, fontStyle: 'italic', color: c.textMuted, textAlign: 'center' },
    notesBlock: { marginTop: 24 },
    notesLabel: { fontSize: 13, fontWeight: '700', color: c.textMuted, marginBottom: 8 },
    notesInput: {
      backgroundColor: c.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      padding: 14,
      fontSize: 15,
      color: c.text,
      minHeight: 70,
      textAlignVertical: 'top',
    },
    safetyFooter: {
      fontSize: 12,
      color: c.textSubtle,
      marginTop: 24,
      lineHeight: 18,
      textAlign: 'center',
    },
  });
