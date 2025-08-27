import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/colors';

export default function WizardTipo() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Tipo de servicio</Text>
      <Text style={styles.muted}>Aquí iniciaremos el wizard (ONE WAY / ROUND TRIP).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  h1: { fontFamily: 'Poppins_800ExtraBold', fontSize: 22, color: COLORS.navy, marginBottom: 6 },
  muted: { fontFamily: 'Poppins_400Regular', color: COLORS.muted },
});
