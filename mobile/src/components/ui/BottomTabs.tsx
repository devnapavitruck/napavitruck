import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../config';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type TabKey = 'finanzas' | 'servicio' | 'documentos';

export default function BottomTabs({ active }: { active: TabKey }) {
  const navigation = useNavigation<Nav>();

  const Item = ({ k, label, icon }: { k: TabKey; label: string; icon: React.ReactNode }) => {
    const isActive = active === k;
    return (
      <TouchableOpacity
        style={[styles.item, isActive && styles.itemActive]}
        onPress={() => {
          if (k === 'finanzas') navigation.replace('ConductorFinanzas' as any);
          if (k === 'servicio') navigation.replace('ConductorServicios');
          if (k === 'documentos') navigation.replace('ConductorDocs');
        }}
      >
        {icon}
        <Text style={[styles.txt, isActive && styles.txtActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrap}>
      <Item
        k="finanzas"
        label="Finanzas"
        icon={<Ionicons name="card-outline" size={20} color={active==='finanzas' ? COLORS.navy : '#6B7280'} />}
      />
      <Item
        k="servicio"
        label="Servicio"
        icon={<Ionicons name="briefcase-outline" size={20} color={active==='servicio' ? COLORS.navy : '#6B7280'} />}
      />
      <Item
        k="documentos"
        label="Documentos"
        icon={<Ionicons name="document-text-outline" size={20} color={active==='documentos' ? COLORS.navy : '#6B7280'} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 64, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: COLORS.line,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
  },
  item: { alignItems: 'center', paddingTop: 6 },
  itemActive: {},
  txt: { fontSize: 12, color: '#6B7280', marginTop: 2, fontWeight: '600' },
  txtActive: { color: COLORS.navy },
});
