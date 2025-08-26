import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiPost } from '../api/client';

type Role = 'CONDUCTOR_DEP' | 'CONDUCTOR_IND' | 'ADMIN_EDT' | 'SUPERADMIN';
type LoginResp = { access_token: string; rol: Role; primerLoginPendiente?: boolean; nombre?: string };

type AuthCtx = {
  token: string | null;
  role: Role | null;
  nombre: string | null;
  signIn: (rut: string, pin: string) => Promise<void>;
  signOut: () => Promise<void>;
  simulateConductor: (role?: Role, nombre?: string) => Promise<void>;
};

const Ctx = createContext<AuthCtx>({} as any);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [t, r, n] = await Promise.all([
        AsyncStorage.getItem('npv_token'),
        AsyncStorage.getItem('npv_role'),
        AsyncStorage.getItem('npv_nombre'),
      ]);
      setToken(t);
      setRole((r as Role) || null);
      setNombre(n);
    })();
  }, []);

  const signIn = async (rut: string, pin: string) => {
    const data = await apiPost<LoginResp>('/api/auth/login', { rut, pin });
    await AsyncStorage.multiSet([
      ['npv_token', data.access_token],
      ['npv_role', data.rol],
      ['npv_nombre', data.nombre || 'Conductor'],
    ]);
    setToken(data.access_token);
    setRole(data.rol);
    setNombre(data.nombre || 'Conductor');
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(['npv_token', 'npv_role', 'npv_nombre']);
    setToken(null);
    setRole(null);
    setNombre(null);
  };

  const simulateConductor = async (r: Role = 'CONDUCTOR_DEP', n = 'Conductor Demo') => {
    await AsyncStorage.multiSet([
      ['npv_token', 'token_demo'],
      ['npv_role', r],
      ['npv_nombre', n],
    ]);
    setToken('token_demo');
    setRole(r);
    setNombre(n);
  };

  const value = useMemo(() => ({ token, role, nombre, signIn, signOut, simulateConductor }), [token, role, nombre]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
