import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppHeader from '../components/AppHeader';
import DocumentosHome from '../screens/Documentos/DocumentosHome';

const Stack = createStackNavigator();

export default function DocumentosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DocumentosHome" component={DocumentosHome} options={{ header: () => <AppHeader /> }} />
    </Stack.Navigator>
  );
}
