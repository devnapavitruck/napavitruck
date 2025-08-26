import * as React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { COLORS } from '../../config';
import { useAuth } from '../../context/AuthContext';

type Props = { open: boolean; onClose: () => void; };

export default function HamburgerMenu({ open, onClose }: Props) {
  const { signOut } = useAuth();

  const Item = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.itemTxt}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={open} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Menú</Text>
          <Item label="Mi perfil" onPress={onClose} />
          <Item label="Ajustes" onPress={onClose} />
          <Item label="Soporte" onPress={onClose} />
          <View style={styles.divider} />
          <Item label="Cerrar sesión" onPress={async () => { await signOut(); onClose(); }} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,.35)', justifyContent: 'flex-start' },
  sheet: { backgroundColor: '#FFF', marginTop: 60, marginHorizontal: 14, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: COLORS.line },
  title: { fontWeight: '800', color: COLORS.navy, fontSize: 16, marginBottom: 6 },
  item: { paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8 },
  itemTxt: { color: '#1F2937', fontWeight: '600' },
  divider: { height: 1, backgroundColor: COLORS.line, marginVertical: 6 },
});
