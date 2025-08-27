import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '../../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DocumentosHome() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Documentos</Text>
      <Text style={styles.muted}>Aquí podrás guardar y consultar tus documentos cuando los necesites.</Text>

      <View style={styles.list}>
        <Row
          title="Documentos personales"
          help="Licencia, cédula, exámenes, etc."
          icon="file-account"
          onPress={() => {}}
        />
        <Row
          title="Documentos Tracto camión"
          help="Permisos, revisión técnica, SOAP…"
          icon="truck-outline"
          onPress={() => {}}
        />
        <Row
          title="Documentos Semirremolque"
          help="Permisos, revisión técnica, mantenciones…"
          icon="truck-trailer"
          onPress={() => {}}
        />
      </View>
    </View>
  );
}

function Row({ title, help, icon, onPress }: { title: string; help: string; icon: any; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.rowLeft}>
        <MaterialCommunityIcons name={icon} size={26} color={COLORS.navy} />
        <View>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowHelp}>{help}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  h1: { fontFamily: 'Poppins_800ExtraBold', fontSize: 22, color: COLORS.navy },
  muted: { fontFamily: 'Poppins_400Regular', color: COLORS.muted, marginTop: 4, marginBottom: 12 },
  list: { gap: 12 },
  row: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    paddingHorizontal: 14, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 12 },
      android: { elevation: 8 },
    }),
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowTitle: { fontFamily: 'Poppins_600SemiBold', color: COLORS.text, fontSize: 15 },
  rowHelp: { fontFamily: 'Poppins_400Regular', color: COLORS.muted, fontSize: 12, marginTop: 2 },
});
