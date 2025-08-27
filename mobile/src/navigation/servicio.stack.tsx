import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppHeader from '../components/AppHeader';
import AppHeaderWizard from '../components/AppHeaderWizard';
import ServiciosHome from '../screens/Servicio/ServiciosHome';
import IngresarCodigo from '../screens/Servicio/IngresarCodigo';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import WizardTipo from '../screens/Servicio/Wizard/TipoServicio';

export type ServicioStackParamList = {
  Dashboard: undefined;
  ServiciosHome: undefined;
  IngresarCodigo: undefined;
  WizardTipo: undefined;
};

const Stack = createStackNavigator<ServicioStackParamList>();

export default function ServicioStack() {
  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ header: () => <AppHeader /> }} />
      <Stack.Screen name="ServiciosHome" component={ServiciosHome} options={{ header: () => <AppHeader /> }} />
      <Stack.Screen name="IngresarCodigo" component={IngresarCodigo} options={{ header: () => <AppHeader /> }} />
      <Stack.Screen
        name="WizardTipo"
        component={WizardTipo}
        options={{ header: () => <AppHeaderWizard title="Nuevo servicio" /> }}
      />
    </Stack.Navigator>
  );
}
