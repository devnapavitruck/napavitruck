import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, TouchableOpacity } from 'react-native';
// 👇 importa también ResizeMode
import { Video, ResizeMode } from 'expo-av';
import { COLORS } from '../../config';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export default function LandingScreen({ navigation }: Props) {
  const videoRef = React.useRef<Video>(null);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../../../assets/landing.mp4')}
        style={styles.video}
        // 👇 usa el enum, no string
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
        isMuted
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.brand}>NapaviTruck</Text>
        <Text style={styles.title}>Movemos tu logística</Text>
        <Text style={styles.sub}>Accede con tu RUT y PIN para comenzar.</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryTxt}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('DevSim')} style={styles.btn}>
          <Text style={styles.btnTxt}>Simular ingreso (dev)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  video: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(14,34,68,0.45)' },
  content: { position: 'absolute', left: 24, right: 24, bottom: 60 },
  brand: { color: '#FFF', fontWeight: '800', fontSize: 18, marginBottom: 8, letterSpacing: 1 },
  title: { color: '#FFF', fontWeight: '800', fontSize: 28, marginBottom: 8 },
  sub: { color: '#E6E9EE', marginBottom: 16 },
  btnPrimary: { backgroundColor: COLORS.navy, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnPrimaryTxt: { color: '#FFF', fontWeight: '700' },
  btn: { marginTop: 10, borderWidth: 1, borderColor: '#FFFFFF66', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnTxt: { color: '#FFF', fontWeight: '700' },
});
