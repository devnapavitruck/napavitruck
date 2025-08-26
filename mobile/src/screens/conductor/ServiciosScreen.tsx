import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native';
import { COLORS } from '../../config';
import ConductorLayout from '../../components/ui/ConductorLayout';

type TabKey = 'CURSO' | 'PROG' | 'HIST';
type Servicio = { codigo: string; origen: string; destino: string; inicio?: string; hora?: string; fin?: string; };

export default function ServiciosScreen() {
  const [tab, setTab] = React.useState<TabKey>('CURSO');

  const data: Record<TabKey, Servicio[]> = {
    CURSO: [{ codigo: 'SV-1019', origen: 'Santiago', destino: 'Valparaíso', inicio: '07:10' }],
    PROG:  [{ codigo: 'SV-1021', origen: 'Santiago', destino: 'Rancagua',  hora:  '09:30' }],
    HIST:  [{ codigo: 'SV-1003', origen: 'Rancagua',  destino: 'Santiago', fin:   'Ayer 18:40' }],
  };

  const tabs = [
    { k: 'CURSO', t: 'En curso' },
    { k: 'PROG',  t: 'Programados' },
    { k: 'HIST',  t: 'Historial' },
  ] as const;

  const items = data[tab];

  return (
    <ConductorLayout activeTab="servicio" showBack>
      <Text style={styles.h1}>Servicios</Text>

      <View style={styles.tabs}>
        {tabs.map(({ k, t }) => (
          <Text
            key={k}
            onPress={() => setTab(k as TabKey)}
            style={[styles.tab, tab === k && styles.tabActive]}
          >
            {t}
          </Text>
        ))}
      </View>

      <ScrollView style={{ marginTop: 10 }}>
        {items.map(s => {
          const momento = s.inicio ?? s.hora ?? s.fin ?? '';
          return (
            <View key={s.codigo} style={styles.row}>
              <Text style={styles.rowTitle}>{s.codigo}</Text>
              <Text style={styles.rowSub}>{s.origen} → {s.destino}</Text>
              <Text style={styles.rowSub}>{momento}</Text>
            </View>
          );
        })}
      </ScrollView>
    </ConductorLayout>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: '800', color: COLORS.navy, marginBottom: 8 },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { borderWidth: 1, borderColor: COLORS.line, borderRadius: 24, paddingHorizontal: 12, height: 36, lineHeight: 36, color: '#4C5564' },
  tabActive: { backgroundColor: '#FFF', color: COLORS.navy, fontWeight: '700' },
  row: { backgroundColor: '#FFF', borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, padding: 12, marginBottom: 8 },
  rowTitle: { fontWeight: '800', color: COLORS.navy },
  rowSub: { color: '#1F2937' },
});
