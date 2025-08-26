import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './context/AuthContext';

import LandingScreen from './screens/landing/LandingScreen';
import LoginScreen from './screens/auth/LoginScreen';
import ChangePinScreen from './screens/auth/ChangePinScreen';

import ConductorHome from './screens/conductor/HomeScreen';
import ConductorServicios from './screens/conductor/ServiciosScreen';
import ConductorDocs from './screens/conductor/DocumentosScreen';
import ConductorFinanzas from './screens/conductor/FinanzasScreen';

import DevSimScreen from './screens/dev/ConductorSimScreen';

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  ChangePin: undefined;

  ConductorHome: undefined;
  ConductorServicios: undefined;
  ConductorDocs: undefined;
  ConductorFinanzas: undefined;

  DevSim: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="DevSim" component={DevSimScreen} />
        <Stack.Screen name="ChangePin" component={ChangePinScreen} />

        <Stack.Screen name="ConductorHome" component={ConductorHome} />
        <Stack.Screen name="ConductorServicios" component={ConductorServicios} />
        <Stack.Screen name="ConductorDocs" component={ConductorDocs} />
        <Stack.Screen name="ConductorFinanzas" component={ConductorFinanzas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
