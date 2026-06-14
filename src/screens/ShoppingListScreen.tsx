/**
 * ShoppingListScreen — alışveriş listesi (kalıcı). Öğeleri işaretle (alındı),
 * sil; alınanları veya tümünü temizle. Sadece UI: shoppingStore action'ları.
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useShoppingStore } from '../state/shoppingStore';
import { t } from '../i18n';

export function ShoppingListScreen({ onBack }: { onBack: () => void }) {
  const items = useShoppingStore((s) => s.items);
  const toggle = useShoppingStore((s) => s.toggle);
  const remove = useShoppingStore((s) => s.remove);
  const clearChecked = useShoppingStore((s) => s.clearChecked);
  const clearAll = useShoppingStore((s) => s.clearAll);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>{t('cooking.back')}</Text>
      </Pressable>
      <Text style={styles.title}>{t('shopping.title')}</Text>

      {items.length === 0 ? (
        <Text style={styles.empty}>{t('shopping.empty')}</Text>
      ) : (
        <>
          {items.map((item) => (
            <View key={item.id} style={styles.row}>
              <Pressable style={styles.check} onPress={() => void toggle(item.id)}>
                <Text style={styles.checkBox}>{item.checked ? '☑' : '☐'}</Text>
                <Text style={[styles.label, item.checked && styles.labelChecked]}>{item.label}</Text>
              </Pressable>
              <Pressable hitSlop={8} onPress={() => void remove(item.id)}>
                <Text style={styles.remove}>✕</Text>
              </Pressable>
            </View>
          ))}

          <View style={styles.actions}>
            <Pressable style={styles.action} onPress={() => void clearChecked()}>
              <Text style={styles.actionText}>{t('shopping.clearChecked')}</Text>
            </Pressable>
            <Pressable style={[styles.action, styles.actionDanger]} onPress={() => void clearAll()}>
              <Text style={styles.actionDangerText}>{t('shopping.clearAll')}</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF8F0' },
  content: { padding: 24, paddingTop: 56, paddingBottom: 40 },
  back: { marginBottom: 8 },
  backText: { color: '#8A6D5B', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 30, fontWeight: '800', color: '#B5300F', marginBottom: 16 },
  empty: { fontSize: 16, color: '#8A6D5B', marginTop: 24, lineHeight: 22 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0E2D6',
  },
  check: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkBox: { fontSize: 20, color: '#B5300F', marginRight: 10 },
  label: { fontSize: 16, color: '#2B2B2B', flex: 1 },
  labelChecked: { color: '#A8927F', textDecorationLine: 'line-through' },
  remove: { fontSize: 18, color: '#C9B7A6', paddingLeft: 8 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  action: { flex: 1, backgroundColor: '#F0E2D6', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  actionText: { color: '#8A6D5B', fontWeight: '600' },
  actionDanger: { backgroundColor: '#FBE3DC' },
  actionDangerText: { color: '#B5300F', fontWeight: '700' },
});
