import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ServiciosHome() {
  const nav = useNavigation<any>();
  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Servicios</Text>
      <Text style={styles.muted}>Elige una opción para comenzar</Text>

      <TouchableOpacity style={styles.cta} activeOpacity={0.9} onPress={() => nav.navigate('WizardTipo')}>
        <MaterialCommunityIcons name="plus-circle-outline" size={28} color={COLORS.white} />
        <Text style={styles.ctaText}>Crear servicio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.cta, styles.ctaAlt]}
        activeOpacity={0.9}
        onPress={() => nav.navigate('IngresarCodigo')}
      >
        <MaterialCommunityIcons name="qrcode-scan" size={28} color={COLORS.navy} />
        <Text style={[styles.ctaText, { color: COLORS.navy }]}>Ingresar código</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  h1: { fontFamily: 'Poppins_800ExtraBold', fontSize: 22, color: COLORS.navy, marginBottom: 6 },
  muted: { fontFamily: 'Poppins_400Regular', color: COLORS.muted, marginBottom: 14 },
  cta: {
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#0d1a33',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 12, elevation: 10,
    flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'center',
  },
  ctaAlt: { backgroundColor: COLORS.white },
  ctaText: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: COLORS.white },
});
