import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { COLORS } from '../../config';

export default function ChangePinScreen() {
  const [pin, setPin] = React.useState('');
  const [pin2, setPin2] = React.useState('');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', padding: 20 }}>
      <Text style={styles.title}>Cambiar PIN</Text>
      <TextInput style={styles.input} placeholder="Nuevo PIN" value={pin} onChangeText={t=>setPin(t.replace(/\D/g,'').slice(0,6))} secureTextEntry keyboardType="number-pad" />
      <TextInput style={styles.input} placeholder="Repetir PIN" value={pin2} onChangeText={t=>setPin2(t.replace(/\D/g,'').slice(0,6))} secureTextEntry keyboardType="number-pad" />
      <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>Guardar</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: COLORS.navy, marginBottom: 16 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: COLORS.line, borderRadius: 10, height: 48, paddingHorizontal: 14, marginBottom: 10 },
  btn: { backgroundColor: COLORS.navy, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  btnText: { color: '#FFF', fontWeight: '700' },
});
