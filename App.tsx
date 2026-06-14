/**
 * Uygulama girişi. Abonelik kapısının (SubscriptionGate) ardında örnek tarifle
 * (menemen) CookingScreen'i açar. İleride tarif seçimi / "ne pişsem" ekranı.
 */
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

import { CookingScreen } from './src/screens/CookingScreen';
import { SubscriptionGate } from './src/components/SubscriptionGate';
import { menemen } from './src/recipes';

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SubscriptionGate>
        <CookingScreen recipe={menemen} />
      </SubscriptionGate>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF8F0' },
});
