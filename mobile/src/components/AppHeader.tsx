import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { DrawerActions, useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';

// Usa el logo que pediste (renómbralo en assets a appbar_logo.png)
const logo = require('../../assets/appbar_logo.png');

export default function AppHeader() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const isHome = route.name === 'Dashboard';

  return (
    <View style={[styles.wrap, { paddingTop: insets.top, height: insets.top + 60 }]}>
      <TouchableOpacity
        accessibilityLabel="Menú"
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialCommunityIcons name="menu" size={26} color={COLORS.white} />
      </TouchableOpacity>

      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <TouchableOpacity
        accessibilityLabel="Ir a inicio"
        onPress={() => navigation.navigate('Dashboard')}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialCommunityIcons
          name="home-outline"
          size={24}
          color={isHome ? COLORS.gold : COLORS.white}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12 },
      android: { elevation: 12 },
    }),
    zIndex: 10,
  },
  logo: { width: 140, height: 40 },
});
