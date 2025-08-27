import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import FinanzasStack from './finanzas.stack';
import DocumentosStack from './documentos.stack';
import ServicioStack from './servicio.stack';

export type TabsParamList = {
  FinanzasTab: undefined;
  ServiciosTab: undefined;
  DocumentosTab: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsRoot() {
  return (
    <Tab.Navigator
      initialRouteName="ServiciosTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.navy,
          borderTopColor: 'transparent',
          height: 88,          // más alta
          paddingBottom: 22,   // “sube” el área táctil
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.lightText,
        tabBarLabelStyle: { fontFamily: 'Poppins_600SemiBold', fontSize: 12, marginBottom: 6 },
        tabBarIconStyle: { marginTop: 4 },
      }}
    >
      <Tab.Screen
        name="FinanzasTab"
        component={FinanzasStack}
        options={{
          tabBarLabel: 'Finanzas',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="finance" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ServiciosTab"
        component={ServicioStack}
        options={{
          tabBarLabel: 'Servicios',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="clipboard-check-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="DocumentosTab"
        component={DocumentosStack}
        options={{
          tabBarLabel: 'Documentos',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="file-document-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
