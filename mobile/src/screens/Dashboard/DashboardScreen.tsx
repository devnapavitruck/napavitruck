import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>¡Bienvenido!</Text>
      <Text style={styles.muted}>Accesos rápidos</Text>

      <View style={styles.grid}>
        <Card title="Crear servicio" icon="plus-circle-outline" onPress={() => navigation.navigate('WizardTipo')} />
        <Card title="Ingresar código" icon="qrcode-scan" onPress={() => navigation.navigate('IngresarCodigo')} />
        <Card title="Mis documentos" icon="file-document-outline" onPress={() => navigation.navigate('DocumentosTab')} />
        <Card title="Crear tracto camión" icon="truck-outline" onPress={() => Alert.alert('Próximamente')} />
        <Card title="Crear semirremolque" icon="truck-trailer" onPress={() => Alert.alert('Próximamente')} />
        <Card title="Ingresar combustible" icon="gas-station" onPress={() => Alert.alert('Próximamente')} />
      </View>
    </View>
  );
}

function Card({ title, icon, onPress }: { title: string; icon: any; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.85}>
      <MaterialCommunityIcons name={icon} size={28} color={COLORS.navy} />
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  h1: { fontFamily: 'Poppins_800ExtraBold', fontSize: 22, color: COLORS.navy, marginBottom: 4 },
  muted: { fontFamily: 'Poppins_400Regular', color: COLORS.muted, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 12, elevation: 10,
    alignItems: 'flex-start', gap: 8,
  },
  cardTitle: { fontFamily: 'Poppins_600SemiBold', color: COLORS.text, fontSize: 14 },
});
