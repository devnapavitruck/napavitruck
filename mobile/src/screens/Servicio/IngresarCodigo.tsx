import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../../theme/colors';

export default function IngresarCodigo() {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);

  const onValidar = async () => {
    const code = codigo.trim().toUpperCase();
    if (code.length < 5) {
      Alert.alert('Código inválido', 'Ingresa un código válido.');
      return;
    }
    try {
      setLoading(true);
      // TODO: llamar API validar/confirmar código
      // const ok = await serviciosApi.validarCodigo(code) ...
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Código aceptado', 'Servicio prellenado listo para continuar.');
      }, 700);
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Error', e?.message ?? 'No se pudo validar el código.');
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Ingresar código</Text>
      <Text style={styles.muted}>Valida el código que te entregó tu administrador.</Text>

      <TextInput
        placeholder="Ej: NPV-ABCD1"
        placeholderTextColor="#9CA3AF"
        autoCapitalize="characters"
        autoCorrect={false}
        value={codigo}
        onChangeText={setCodigo}
        style={styles.input}
      />

      <TouchableOpacity disabled={loading} onPress={onValidar} style={[styles.btn, loading && { opacity: 0.6 }]}>
        <Text style={styles.btnText}>{loading ? 'Validando…' : 'Validar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  h1: { fontFamily: 'Poppins_800ExtraBold', fontSize: 22, color: COLORS.navy, marginBottom: 6 },
  muted: { fontFamily: 'Poppins_400Regular', color: COLORS.muted, marginBottom: 14 },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 14,
    height: 48,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 1,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: COLORS.navy,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // Sombras 3D
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
  btnText: { color: COLORS.white, fontFamily: 'Poppins_600SemiBold', fontSize: 16 },
});
