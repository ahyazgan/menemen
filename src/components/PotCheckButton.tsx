/**
 * PotCheckButton — frame-on-demand kamera (CLAUDE.md: sürekli akış YOK).
 * Kamera YALNIZCA kullanıcı "tencereye bak" deyince modalde açılır, tek kare
 * çekilir, store.checkPot(base64)'e verilir ve kamera kapanır.
 */
import { useMemo, useRef, useState } from 'react';
import { Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { useCookingStore } from '../state/cookingStore';
import { useThemeColors } from '../state/uiStore';
import { t } from '../i18n';
import type { ThemeColors } from '../config/theme';

export function PotCheckButton() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [denied, setDenied] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const checkPot = useCookingStore((s) => s.checkPot);
  const cameraRef = useRef<CameraView | null>(null);

  async function openCamera(): Promise<void> {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        setDenied(true);
        return;
      }
    }
    setDenied(false);
    setOpen(true);
  }

  async function capture(): Promise<void> {
    if (busy) return;
    setBusy(true);
    try {
      const picture = await cameraRef.current?.takePictureAsync({ base64: true, quality: 0.5 });
      setOpen(false);
      if (picture?.base64) {
        await checkPot(`data:image/jpeg;base64,${picture.base64}`);
      }
    } finally {
      setBusy(false);
    }
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

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modal}>
          {/* Kamera yalnızca modal açıkken monte edilir → frame-on-demand. */}
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
          <View style={styles.controls}>
            <Pressable
              style={styles.captureBtn}
              onPress={() => void capture()}
              accessibilityRole="button"
              accessibilityLabel={t('cooking.capture')}
            >
              <Text style={styles.captureText}>{t('cooking.capture')}</Text>
            </Pressable>
            <Pressable
              style={styles.closeBtn}
              onPress={() => setOpen(false)}
              accessibilityRole="button"
              accessibilityLabel={t('cooking.close')}
            >
              <Text style={styles.closeText}>{t('cooking.close')}</Text>
            </Pressable>
          </View>
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
    camera: { flex: 1 },
    controls: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 24,
      backgroundColor: '#000',
    },
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
    closeText: { color: '#FFF', fontSize: 16 },
  });
