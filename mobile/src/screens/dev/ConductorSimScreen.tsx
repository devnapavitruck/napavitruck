import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../config';
import { normalizaRut } from '../../utils/rut';
import { useAuth } from '../../context/AuthContext';
import type { RootStackParamList } from '../../App';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ConductorSimScreen() {
  const navigation = useNavigation<Nav>();
  const { simulateConductor } = useAuth();
  const [rut, setRut] = React.useState('22.111.555-6');
  const [nombre, setNombre] = React.useState('Conductor Demo');
  const [rol, setRol] = React.useState<'CONDUCTOR_DEP'|'CONDUCTOR_IND'>('CONDUCTOR_DEP');

  const go = async () => {
    await simulateConductor(rol, nombre);
    navigation.replace('ConductorHome'); // ← entrar al Home
  };

  return (
    <View style={{ flex:1, backgroundColor: COLORS.bg, justifyContent: 'center', padding: 20 }}>
      <Text style={styles.h1}>Simular ingreso de Conductor</Text>
      <TextInput style={styles.input} placeholder="RUT" value={rut} onChangeText={t=>setRut(normalizaRut(t))} />
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Rol (CONDUCTOR_DEP o CONDUCTOR_IND)" value={rol} onChangeText={t=>setRol((t as any) || 'CONDUCTOR_DEP')} />
      <TouchableOpacity onPress={go} style={styles.btn}><Text style={styles.btnTxt}>Ingresar</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: '800', color: COLORS.navy, marginBottom: 16 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: COLORS.line, borderRadius: 10, height: 48, paddingHorizontal: 14, marginBottom: 10 },
  btn: { backgroundColor: COLORS.navy, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnTxt: { color: '#FFF', fontWeight: '700' },
});
