import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default function DocumentosList() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Documentos</Text>
      <Text style={styles.muted}>Aquí verás tus PDFs generados.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  h1: { fontFamily: 'Poppins_800ExtraBold', fontSize: 22, color: COLORS.navy, marginBottom: 6 },
  muted: { fontFamily: 'Poppins_400Regular', color: COLORS.muted, marginBottom: 14 },
});
