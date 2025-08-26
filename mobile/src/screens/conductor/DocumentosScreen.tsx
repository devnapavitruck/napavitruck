import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../config';
import ConductorLayout from '../../components/ui/ConductorLayout';

export default function DocumentosScreen() {
  const docs = [
    { nombre: 'Licencia de Conducir', estado: 'Vigente', vence: '12/09/2025' },
    { nombre: 'Cédula de Identidad', estado: 'Vigente', vence: '—' },
    { nombre: 'Examen Médico', estado: 'Pendiente', vence: '—' },
  ];

  return (
    <ConductorLayout activeTab="documentos" showBack>
      <Text style={styles.h1}>Mis documentos</Text>
      {docs.map(d=>(
        <View key={d.nombre} style={styles.row}>
          <Text style={styles.rowTitle}>{d.nombre}</Text>
          <Text style={styles.rowSub}>Estado: {d.estado}</Text>
          <Text style={styles.rowSub}>Vence: {d.vence}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.btn}><Text style={styles.btnTxt}>+ Subir</Text></TouchableOpacity>
    </ConductorLayout>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: '800', color: COLORS.navy, marginBottom: 10 },
  row: { backgroundColor: '#FFF', borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, padding: 12, marginBottom: 8 },
  rowTitle: { fontWeight: '800', color: COLORS.navy },
  rowSub: { color: '#1F2937' },
  btn: { borderWidth: 1, borderColor: COLORS.line, height: 44, borderRadius: 10, justifyContent: 'center', paddingHorizontal: 14, marginTop: 8, alignSelf: 'flex-start' },
  btnTxt: { color: COLORS.navy, fontWeight: '700' },
});
