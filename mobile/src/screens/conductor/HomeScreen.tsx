import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../config';
import ConductorLayout from '../../components/ui/ConductorLayout';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const { nombre } = useAuth();
  const navigation = useNavigation<Nav>();

  // Notificaciones demo
  const notificaciones = [
    { id: 'n1', texto: 'Nuevo servicio asignado para hoy 09:30' },
    { id: 'n2', texto: 'Permiso de circulación del tracto vence en 10 días' },
  ];

  const proximo = { codigo: 'SV-1021', origen: 'Santiago', destino: 'Rancagua', hora: '09:30', estado: 'Programado' };

  return (
    <ConductorLayout activeTab="servicio" /* Home no muestra botón atrás */>
      <Text style={styles.h1}>Hola, {nombre || 'Conductor'}</Text>
      <Text style={styles.sub}>Este es tu resumen de hoy.</Text>

      <View style={styles.card}>
        <Text style={styles.h2}>Notificaciones</Text>
        {notificaciones.map(n => (
          <View key={n.id} style={styles.note}>
            <View style={styles.bullet} />
            <Text style={styles.p}>{n.texto}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.h2}>Próximo servicio</Text>
        <Text style={styles.p}><Text style={styles.bold}>{proximo.codigo}</Text> • {proximo.origen} → {proximo.destino}</Text>
        <Text style={styles.p}>Estado: {proximo.estado} • Hora {proximo.hora}</Text>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <TouchableOpacity style={styles.btnPrimary}><Text style={styles.btnPrimaryTxt}>Iniciar</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.replace('ConductorServicios')}>
            <Text style={styles.btnTxt}>Ver todos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ConductorLayout>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: '800', color: COLORS.navy },
  sub: { color: '#4C5564', marginBottom: 12 },
  card: { backgroundColor: '#FFF', borderWidth: 1, borderColor: COLORS.line, borderRadius: 14, padding: 16, marginBottom: 12 },
  h2: { fontSize: 16, fontWeight: '800', color: COLORS.navy, marginBottom: 6 },
  p: { color: '#1F2937', marginBottom: 2 },
  bold: { fontWeight: '700' },
  note: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.navy, marginRight: 8 },
  btnPrimary: { backgroundColor: COLORS.navy, paddingHorizontal: 14, height: 44, borderRadius: 10, justifyContent: 'center' },
  btnPrimaryTxt: { color: '#FFF', fontWeight: '700' },
  btn: { borderWidth: 1, borderColor: COLORS.line, height: 44, borderRadius: 10, justifyContent: 'center', paddingHorizontal: 14 },
  btnTxt: { color: COLORS.navy, fontWeight: '700' },
});
