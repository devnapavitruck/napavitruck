import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppHeader from '../components/AppHeader';
import FinanzasHome from '../screens/Finanzas/FinanzasHome';

const Stack = createStackNavigator();

export default function FinanzasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FinanzasHome" component={FinanzasHome} options={{ header: () => <AppHeader /> }} />
    </Stack.Navigator>
  );
}
