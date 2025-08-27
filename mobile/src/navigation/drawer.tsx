import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabsRoot from './tabs';
import { COLORS } from '../theme/colors';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

const Drawer = createDrawerNavigator();

function Placeholder({ title, body, children }: { title: string; body?: string; children?: React.ReactNode }) {
  return (
    <ScrollView contentContainerStyle={styles.phWrap}>
      <Text style={styles.phTitle}>{title}</Text>
      {body ? <Text style={styles.phBody}>{body}</Text> : null}
      {children}
    </ScrollView>
  );
}

export default function DrawerRoot() {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: COLORS.navy, width: 280 },
        drawerActiveTintColor: COLORS.gold,
        drawerInactiveTintColor: '#cdd5df',
        drawerLabelStyle: { fontFamily: 'Poppins_600SemiBold' },
      }}
    >
      <Drawer.Screen name="Main" component={TabsRoot} options={{ title: 'Inicio' }} />
      <Drawer.Screen
        name="Perfil"
        options={{ title: 'Mi perfil' }}
        children={() => (
          <Placeholder title="Mi perfil" body="Edita tu teléfono y revisa tus datos.">
            <View style={{ height: 16 }} />
            <TouchableOpacity
              onPress={() => Alert.alert('Eliminar cuenta', 'Esta acción solicitará tu PIN para confirmar.', [{ text: 'Entendido' }])}
              style={styles.dangerBtn}
              activeOpacity={0.9}
            >
              <Text style={styles.dangerText}>Eliminar cuenta</Text>
            </TouchableOpacity>
          </Placeholder>
        )}
      />
      <Drawer.Screen name="Mi Flota" children={() => <Placeholder title="Mi Flota" body="Tracto y Semi (solo lectura por ahora)." />} />
      <Drawer.Screen name="Historial" children={() => <Placeholder title="Historial de servicios" body="Listado y filtros básicos." />} />
      <Drawer.Screen name="Ayuda" children={() => <Placeholder title="Ayuda" body="Preguntas frecuentes." />} />
      <Drawer.Screen name="Soporte" children={() => <Placeholder title="Soporte" body="Contacto: soporte@napavitruck.cl" />} />
      <Drawer.Screen name="Privacidad" children={() => <Placeholder title="Políticas de Privacidad" body="Texto legal requerido por tiendas." />} />
      <Drawer.Screen name="Términos" children={() => <Placeholder title="Términos de Uso" body="Condiciones del servicio." />} />
      <Drawer.Screen name="Cerrar sesión" children={() => <Placeholder title="Cerrar sesión" body="Pronto: limpieza de tokens y retorno al login." />} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  phWrap: { flexGrow: 1, padding: 16, backgroundColor: '#fff' },
  phTitle: { fontFamily: 'Poppins_800ExtraBold', fontSize: 20, marginBottom: 8, color: COLORS.navy },
  phBody: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#111' },
  dangerBtn: {
    backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fecaca', borderRadius: 12,
    height: 48, alignItems: 'center', justifyContent: 'center',
  },
  dangerText: { color: '#b91c1c', fontFamily: 'Poppins_600SemiBold', fontSize: 15 },
});
