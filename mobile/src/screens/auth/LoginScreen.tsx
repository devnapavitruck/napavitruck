import * as React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../config';
import { normalizaRut } from '../../utils/rut';
import type { RootStackParamList } from '../../App';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { signIn } = useAuth();
  const [rut, setRut] = React.useState('18.506.985-0');
  const [pin, setPin] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState('');

  const onSubmit = async () => {
    try {
      setLoading(true);
      setErr('');
      await signIn(rut.toUpperCase(), pin);
      navigation.replace('ConductorHome'); // ← ir al Home del Conductor
    } catch {
      setErr('Credenciales inválidas o conexión fallida.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles.wrap}>
        <Text style={styles.title}>Bienvenido Conductor</Text>
        <Text style={styles.sub}>Ingresa con tu RUT y PIN</Text>

        <TextInput
          style={[styles.input, err && { borderColor: '#E53E3E' }]}
          placeholder="RUT"
          value={rut}
          onChangeText={(t)=> setRut(normalizaRut(t))}
          autoCapitalize="characters"
        />
        <TextInput
          style={[styles.input, err && { borderColor: '#E53E3E' }]}
          placeholder="PIN (6 dígitos)"
          secureTextEntry
          value={pin}
          onChangeText={(t)=> setPin(t.replace(/\D/g,'').slice(0,6))}
          keyboardType="number-pad"
          maxLength={6}
        />
        {!!err && <Text style={styles.err}>{err}</Text>}

        <TouchableOpacity onPress={onSubmit} disabled={loading} style={[styles.btn, loading && { opacity: .6 }]}>
          <Text style={styles.btnText}>{loading ? 'Ingresando…' : 'Ingresar'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.navy, marginBottom: 4 },
  sub: { fontSize: 14, color: '#4C5564', marginBottom: 16 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: COLORS.line, borderRadius: 10, height: 48, paddingHorizontal: 14, marginBottom: 10 },
  err: { color: '#B42318', marginBottom: 10 },
  btn: { backgroundColor: COLORS.navy, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  btnText: { color: '#FFF', fontWeight: '700' },
});
