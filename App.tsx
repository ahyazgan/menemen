/**
 * Uygulama girişi. Şimdilik doğrudan örnek tarifle (menemen) CookingScreen'i
 * açar; ileride tarif seçimi / "ne pişsem" ekranı eklenecek.
 */
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

import { CookingScreen } from './src/screens/CookingScreen';
import { menemen } from './src/recipes';

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <CookingScreen recipe={menemen} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF8F0' },
});
