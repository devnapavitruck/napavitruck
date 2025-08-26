import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../config';
import TopBar from './TopBar';
import BottomTabs from './BottomTabs';

export default function ConductorLayout({
  children,
  showBack = false,
  activeTab,
}: {
  children: React.ReactNode;
  showBack?: boolean;
  activeTab: 'finanzas' | 'servicio' | 'documentos';
}) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <TopBar showBack={showBack} />
      <View style={styles.body}>{children}</View>
      <BottomTabs active={activeTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  body: { flex: 1, padding: 16 },
});
