/**
 * PotCheckButton — frame-on-demand kamera (CLAUDE.md: sürekli akış YOK).
 * Kamera YALNIZCA kullanıcı "tencereye bak" deyince modalde açılır. Profesyonel
 * yakalama: çerçeve kılavuzu, fener, kamera çevir; tek kare çekilir,
 * store.checkPot ile Vision'a verilir ve **gözlem + öneri** modalde gösterilir.
 *
 * GIDA GÜVENLİĞİ: kritik adımda asla "tamam/pişti" denmez — gözlem + güvenlik
 * uyarısı gösterilir (store.checkPot da kritikte temkinli konuşur).
 */
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';

import { useCookingStore } from '../state/cookingStore';
import { useUiStore, useThemeColors } from '../state/uiStore';
import { useStepPhotosStore } from '../state/stepPhotosStore';
import { localize } from '../engine';
import { t } from '../i18n';
import type { ThemeColors } from '../config/theme';
import type { VisionResult } from '../services/types';

export function PotCheckButton() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [denied, setDenied] = useState(false);
  const [torch, setTorch] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [result, setResult] = useState<VisionResult | null>(null);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [photoSaved, setPhotoSaved] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const locale = useUiStore((s) => s.locale);
  const checkPot = useCookingStore((s) => s.checkPot);
  const cameraRef = useRef<CameraView | null>(null);

  // Aktif adım kritik mi? (gözlem sonucunda güvenlik dili için)
  const engine = useCookingStore((s) => s.engine);
  const currentNodeId = useCookingStore((s) => s.currentNodeId);
  const recipe = useCookingStore((s) => s.recipe);
  const setStepUri = useStepPhotosStore((s) => s.setUri);
  const node = engine && currentNodeId ? engine.node(currentNodeId) : null;
  const critical = node?.safety?.critical ?? false;

  function saveStepPhoto(): void {
    if (!capturedUri || !recipe || !currentNodeId) return;
    void setStepUri(recipe.id, currentNodeId, capturedUri);
    setPhotoSaved(true);
  }

  async function openCamera(): Promise<void> {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        setDenied(true);
        return;
      }
    }
    setDenied(false);
    setResult(null);
    setOpen(true);
  }

  async function capture(): Promise<void> {
    if (busy) return;
    setBusy(true);
    try {
      const picture = await cameraRef.current?.takePictureAsync({ base64: true, quality: 0.5 });
      if (picture?.base64) {
        setCapturedUri(picture.uri ?? null);
        setPhotoSaved(false);
        await checkPot(`data:image/jpeg;base64,${picture.base64}`);
        setResult(useCookingStore.getState().lastVision);
      }
    } finally {
      setBusy(false);
    }
  }

  function retake(): void {
    setResult(null);
    setCapturedUri(null);
    setPhotoSaved(false);
  }

  function close(): void {
    setOpen(false);
    setTorch(false);
    setCapturedUri(null);
    setPhotoSaved(false);
  }

  return (
    <>
      <Pressable
        style={styles.checkBtn}
        onPress={() => void openCamera()}
        accessibilityRole="button"
        accessibilityLabel={t('cooking.check')}
      >
        <Text style={styles.checkText}>📷 {t('cooking.check')}</Text>
      </Pressable>
      {denied && (
        <View style={styles.deniedRow}>
          <Text style={styles.deniedText}>{t('cooking.cameraDenied')}</Text>
          <Pressable
            onPress={() => void Linking.openSettings()}
            accessibilityRole="button"
            accessibilityLabel={t('cooking.openSettings')}
          >
            <Text style={styles.deniedLink}>{t('cooking.openSettings')}</Text>
          </Pressable>
        </View>
      )}

      <Modal visible={open} animationType="slide" onRequestClose={close}>
        <View style={styles.modal}>
          {result ? (
            // Sonuç paneli (gözlem + öneri / kritikte güvenlik)
            <View style={styles.resultWrap}>
              <Text style={styles.resultTitle}>{t('cooking.potCheckTitle')}</Text>
              <Text style={styles.observation}>{result.observation}</Text>
              {critical ? (
                <View style={styles.safetyBox}>
                  <Text style={styles.safetyText}>
                    ⚠️ {node?.safety ? localize(node.safety.message, locale) : t('safety.general')}
                  </Text>
                </View>
              ) : (
                <Text style={styles.suggestion}>{result.suggestion}</Text>
              )}
              <Text style={styles.confidence}>
                {t('cooking.visionConfidence')}: %{Math.round(result.confidence * 100)}
              </Text>
              {capturedUri && (
                <Pressable
                  style={styles.savePhoto}
                  onPress={saveStepPhoto}
                  disabled={photoSaved}
                  accessibilityRole="button"
                  accessibilityLabel={t('cooking.saveAsStepPhoto')}
                >
                  <Text style={styles.savePhotoText}>
                    {photoSaved ? t('cooking.photoSaved') : t('cooking.saveAsStepPhoto')}
                  </Text>
                </Pressable>
              )}
              <View style={styles.resultActions}>
                <Pressable style={styles.captureBtn} onPress={retake}>
                  <Text style={styles.captureText}>{t('cooking.retake')}</Text>
                </Pressable>
                <Pressable style={styles.closeBtn} onPress={close}>
                  <Text style={styles.closeText}>{t('cooking.close')}</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              {/* Kamera yalnızca modal açıkken monte edilir → frame-on-demand. */}
              <View style={styles.cameraWrap}>
                <CameraView
                  ref={cameraRef}
                  style={styles.camera}
                  facing={facing}
                  enableTorch={torch}
                />
                {/* Çerçeve kılavuzu + ipucu */}
                <View pointerEvents="none" style={styles.overlay}>
                  <View style={styles.frame} />
                  <Text style={styles.hint}>{t('cooking.frameHint')}</Text>
                </View>
                {busy && (
                  <View style={styles.analyzing}>
                    <ActivityIndicator color="#FFF" />
                    <Text style={styles.analyzingText}>{t('cooking.analyzing')}</Text>
                  </View>
                )}
              </View>
              <View style={styles.controls}>
                <Pressable
                  style={styles.smallBtn}
                  onPress={() => setTorch((v) => !v)}
                  accessibilityRole="button"
                  accessibilityLabel={t('cooking.torch')}
                >
                  <Text style={styles.smallText}>{torch ? '🔦' : '💡'}</Text>
                </Pressable>
                <Pressable
                  style={styles.captureBtn}
                  onPress={() => void capture()}
                  accessibilityRole="button"
                  accessibilityLabel={t('cooking.capture')}
                >
                  <Text style={styles.captureText}>{t('cooking.capture')}</Text>
                </Pressable>
                <Pressable
                  style={styles.smallBtn}
                  onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
                  accessibilityRole="button"
                  accessibilityLabel={t('cooking.flip')}
                >
                  <Text style={styles.smallText}>🔄</Text>
                </Pressable>
              </View>
              <Pressable style={styles.closeWide} onPress={close}>
                <Text style={styles.closeText}>{t('cooking.close')}</Text>
              </Pressable>
            </>
          )}
        </View>
      </Modal>
    </>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    checkBtn: {
      marginTop: 12,
      backgroundColor: c.fill,
      borderRadius: 30,
      paddingVertical: 14,
      alignItems: 'center',
    },
    checkText: { color: c.textMuted, fontSize: 16, fontWeight: '600' },
    deniedRow: { marginTop: 8, alignItems: 'center' },
    deniedText: { color: c.warning, fontSize: 13, textAlign: 'center', lineHeight: 18 },
    deniedLink: { color: c.primary, fontSize: 14, fontWeight: '700', marginTop: 4 },
    modal: { flex: 1, backgroundColor: '#000' },
    cameraWrap: { flex: 1 },
    camera: { flex: 1 },
    overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
    frame: {
      width: '78%',
      aspectRatio: 1,
      borderRadius: 24,
      borderWidth: 3,
      borderColor: 'rgba(255,255,255,0.85)',
    },
    hint: {
      color: '#FFF',
      fontSize: 15,
      fontWeight: '600',
      marginTop: 18,
      backgroundColor: 'rgba(0,0,0,0.45)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
    },
    analyzing: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    analyzingText: { color: '#FFF', marginTop: 10, fontSize: 16, fontWeight: '600' },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingVertical: 18,
      backgroundColor: '#000',
    },
    smallBtn: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#222',
      alignItems: 'center',
      justifyContent: 'center',
    },
    smallText: { fontSize: 24 },
    captureBtn: {
      backgroundColor: c.primary,
      borderRadius: 30,
      paddingVertical: 14,
      paddingHorizontal: 36,
    },
    captureText: { color: c.onPrimary, fontSize: 17, fontWeight: '700' },
    closeBtn: {
      backgroundColor: '#333',
      borderRadius: 30,
      paddingVertical: 14,
      paddingHorizontal: 28,
    },
    closeWide: { paddingVertical: 16, alignItems: 'center', backgroundColor: '#000' },
    closeText: { color: '#FFF', fontSize: 16 },
    // Sonuç paneli
    resultWrap: { flex: 1, backgroundColor: c.bg, padding: 24, paddingTop: 56 },
    resultTitle: { fontSize: 22, fontWeight: '800', color: c.primary, marginBottom: 12 },
    observation: { fontSize: 18, color: c.text, lineHeight: 26 },
    suggestion: { fontSize: 16, color: c.textBody, lineHeight: 24, marginTop: 12 },
    safetyBox: {
      backgroundColor: c.warningBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.warningBorder,
      padding: 14,
      marginTop: 14,
    },
    safetyText: { color: c.warning, fontSize: 15, fontWeight: '600', lineHeight: 22 },
    confidence: { fontSize: 13, color: c.textSubtle, marginTop: 14 },
    savePhoto: {
      marginTop: 16,
      backgroundColor: c.fill,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
    },
    savePhotoText: { color: c.textMuted, fontSize: 15, fontWeight: '700' },
    resultActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  });
