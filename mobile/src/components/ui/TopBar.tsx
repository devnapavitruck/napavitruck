import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../config';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import HamburgerMenu from './HamburgerMenu';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function TopBar({ showBack = false }: { showBack?: boolean }) {
  const navigation = useNavigation<Nav>();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <>
      <View style={styles.wrap}>
        <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.iconBtn} accessibilityLabel="Abrir menú">
          <Ionicons name="menu" size={22} color={COLORS.navy} />
        </TouchableOpacity>

        <View style={styles.center}>
          {/* Logo centrado — sustituir por Image más adelante */}
          <Text style={styles.brand}>NapaviTruck</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.replace('ConductorHome')} style={styles.iconBtn} accessibilityLabel="Ir a inicio">
          <Ionicons name="home-outline" size={22} color={COLORS.navy} />
        </TouchableOpacity>
      </View>

      {showBack && (
        <View style={styles.backWrap}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color={COLORS.navy} />
            <Text style={styles.backTxt}>Atrás</Text>
          </TouchableOpacity>
        </View>
      )}

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 56, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: COLORS.line,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12,
  },
  iconBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center' },
  brand: { color: COLORS.navy, fontWeight: '800', fontSize: 16, letterSpacing: 0.5 },
  backWrap: { backgroundColor: COLORS.bg },
  backBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6 },
  backTxt: { color: COLORS.navy, fontWeight: '700' },
});
