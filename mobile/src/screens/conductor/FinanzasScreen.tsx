import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { COLORS } from '../../config';
import ConductorLayout from '../../components/ui/ConductorLayout';

export default function FinanzasScreen() {
  // Datos demo
  const resumen = [
    { k: 'Servicios del mes', v: 12 },
    { k: 'Ingresos estimados', v: '$ 1.420.000' },
    { k: 'Pendientes de pago', v: '$ 320.000' },
  ];

  return (
    <ConductorLayout activeTab="finanzas" showBack>
      <Text style={styles.h1}>Finanzas</Text>
      {resumen.map(r => (
        <View key={r.k} style={styles.row}>
          <Text style={styles.rowK}>{r.k}</Text>
          <Text style={styles.rowV}>{r.v}</Text>
        </View>
      ))}
      <View style={styles.card}>
        <Text style={styles.h2}>Últimos movimientos</Text>
        <Text style={styles.p}>• 12/08: Servicio SV-1003 • $120.000</Text>
        <Text style={styles.p}>• 10/08: Servicio SV-0998 • $90.000</Text>
      </View>
    </ConductorLayout>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: '800', color: COLORS.navy, marginBottom: 10 },
  row: { backgroundColor: '#FFF', borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  rowK: { color: '#1F2937', fontWeight: '600' },
  rowV: { color: COLORS.navy, fontWeight: '800' },
  card: { backgroundColor: '#FFF', borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, padding: 12, marginTop: 8 },
  h2: { fontSize: 16, fontWeight: '800', color: COLORS.navy, marginBottom: 6 },
  p: { color: '#1F2937', marginBottom: 2 },
});
