import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '../../theme/colors';

type Ingresos = {
  valorServicio: number;
  valorSobreestadia: number;
  valorFalsoFlete: number;
}
type Egresos = {
  combustibleLitros: number;
  combustiblePesos: number;
  peajes: number;
  viaticos: number;
  reparaciones: number;
  estacionamiento: number;
  otro: number;
}

function clp(n: number) {
  try { return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n); }
  catch { return `$${Math.round(n).toLocaleString('es-CL')}`; }
}

export default function FinanzasHome() {
  const [tab, setTab] = useState<'INGRESOS' | 'EGRESOS'>('INGRESOS');

  // TODO: reemplazar por datos de API (mes en curso)
  const ingresos: Ingresos = { valorServicio: 0, valorSobreestadia: 0, valorFalsoFlete: 0 };
  const egresos: Egresos = { combustibleLitros: 0, combustiblePesos: 0, peajes: 0, viaticos: 0, reparaciones: 0, estacionamiento: 0, otro: 0 };

  const totalIngresos = useMemo(() => ingresos.valorServicio + ingresos.valorSobreestadia + ingresos.valorFalsoFlete, [ingresos]);
  const totalEgresosPesos = useMemo(
    () => egresos.combustiblePesos + egresos.peajes + egresos.viaticos + egresos.reparaciones + egresos.estacionamiento + egresos.otro,
    [egresos]
  );

  const periodo = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
  }, []);

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Finanzas</Text>
      <Text style={styles.muted}>Período: {periodo}</Text>

      <View style={styles.tabs}>
        <TabBtn active={tab === 'INGRESOS'} label="INGRESOS" onPress={() => setTab('INGRESOS')} />
        <TabBtn active={tab === 'EGRESOS'} label="EGRESOS" onPress={() => setTab('EGRESOS')} />
      </View>

      {tab === 'INGRESOS' ? (
        <View style={styles.card}>
          <Row label="Valor servicio" value={clp(ingresos.valorServicio)} />
          <Row label="Sobreestadia" value={clp(ingresos.valorSobreestadia)} />
          <Row label="Falso flete" value={clp(ingresos.valorFalsoFlete)} />
          <View style={styles.hr} />
          <Row label="TOTAL mes" value={clp(totalIngresos)} bold />
        </View>
      ) : (
        <View style={styles.card}>
          <Row label="Combustible ($)" value={clp(egresos.combustiblePesos)} />
          <Row label="Peajes" value={clp(egresos.peajes)} />
          <Row label="Viáticos" value={clp(egresos.viaticos)} />
          <Row label="Reparaciones" value={clp(egresos.reparaciones)} />
          <Row label="Estacionamiento" value={clp(egresos.estacionamiento)} />
          <Row label="Otro" value={clp(egresos.otro)} />
          <View style={styles.hr} />
          <Row label="TOTAL mes" value={clp(totalEgresosPesos)} bold />
          <View style={{ height: 8 }} />
          <Row label="Combustible (litros)" value={`${egresos.combustibleLitros} L`} />
        </View>
      )}
    </View>
  );
}

function TabBtn({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tabBtn, active && styles.tabBtnActive]} activeOpacity={0.9}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, bold && { fontFamily: 'Poppins_800ExtraBold' }]}>{label}</Text>
      <Text style={[styles.value, bold && { fontFamily: 'Poppins_800ExtraBold' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  h1: { fontFamily: 'Poppins_800ExtraBold', fontSize: 22, color: COLORS.navy, textAlign: 'center' },
  muted: { fontFamily: 'Poppins_400Regular', color: COLORS.muted, textAlign: 'center', marginBottom: 12 },
  tabs: { flexDirection: 'row', gap: 8, alignSelf: 'center', marginBottom: 12 },
  tabBtn: {
    paddingVertical: 10, paddingHorizontal: 18, borderRadius: 999,
    backgroundColor: '#e8ebf0', borderWidth: 1, borderColor: '#dbe0e6',
  },
  tabBtnActive: { backgroundColor: COLORS.navy, borderColor: '#0d1a33' },
  tabText: { fontFamily: 'Poppins_600SemiBold', color: COLORS.navy },
  tabTextActive: { color: COLORS.white },
  card: {
    backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 1, borderColor: COLORS.cardBorder, padding: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 12 },
      android: { elevation: 10 },
    }),
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  label: { fontFamily: 'Poppins_600SemiBold', color: COLORS.text },
  value: { fontFamily: 'Poppins_600SemiBold', color: COLORS.navy },
  hr: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 8 },
});
