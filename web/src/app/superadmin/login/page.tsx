'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box, Paper, Typography, Stack, TextField, Button, Alert, Fade,
} from '@mui/material';

// Assets
import Logo from '../../images/01-ImagotipoPrincipal.svg';
import Hero from '../../images/landingpage.jpg';

const NAVY = '#0E2244';

export default function SuperadminLoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/superadmin/dashboard';

  const [rut, setRut] = React.useState('18.506.985-0'); // demo
  const [pin, setPin] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${api}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut, pin }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json() as { access_token: string; rol: string; nombre?: string };

      if (data.rol !== 'SUPERADMIN') {
        setErr('Este portal es exclusivo para el SUPERADMIN.');
        return;
      }

      // Sesión separada del SA (no toca npv_* del admin de flota)
      sessionStorage.setItem('sa_token', data.access_token);
      sessionStorage.setItem('sa_role', data.rol);
      if (data.nombre) sessionStorage.setItem('sa_nombre', data.nombre);

      router.replace(next);
    } catch {
      setErr('Credenciales inválidas o error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight:'100dvh', display:'grid', gridTemplateColumns:{ xs:'1fr', md:'1.15fr 0.85fr' } }}>
      {/* Columna izquierda: formulario */}
      <Box sx={{ p:{ xs:3, md:6 }, display:'flex', alignItems:'center', bgcolor:'#F6F8FB' }}>
        <Fade in timeout={300}>
          <Box component="form" onSubmit={submit} sx={{ width:'100%', maxWidth: 540, mx:'auto' }}>
            <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:3 }}>
              <Image src={Logo} alt="NapaviTruck" width={140} height={40} priority />
            </Box>

            <Paper elevation={0} sx={{ p:{ xs:2.5, md:3 }, border:'1px solid #E6E9EE', borderRadius:3, bgcolor:'#FFF' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb:0.5, color:NAVY }}>
                Inicia sesión — SUPERADMIN
              </Typography>
              <Typography variant="body2" sx={{ color:'#4C5564', mb:2 }}>
                Ingresa tu <b>RUT + PIN</b> para acceder al panel maestro.
              </Typography>

              <Stack spacing={1.5}>
                <TextField
                  label="RUT"
                  value={rut}
                  onChange={(e)=>setRut(e.target.value)}
                  inputProps={{ 'aria-label':'RUT del SUPERADMIN' }}
                />
                <TextField
                  label="PIN"
                  type="password"
                  value={pin}
                  onChange={(e)=>setPin(e.target.value)}
                  inputProps={{ 'aria-label':'PIN del SUPERADMIN' }}
                />
                {err && <Alert severity="error">{err}</Alert>}
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{
                    bgcolor: NAVY,
                    '&:hover': { bgcolor: '#0B1C37' },
                    height: 44, borderRadius: 2,
                  }}
                >
                  {loading ? 'Ingresando…' : 'Ingresar'}
                </Button>
                <Typography variant="caption" sx={{ color:'#6B7280' }}>
                  ¿Olvidaste el PIN? Podemos resetearlo de forma segura.
                </Typography>
              </Stack>
            </Paper>

            <Typography variant="caption" sx={{ display:'block', mt:2, color:'#6B7280' }}>
              © {new Date().getFullYear()} NapaviTruck. Acceso exclusivo para el único SUPERADMIN.
            </Typography>
          </Box>
        </Fade>
      </Box>

      {/* Columna derecha: hero */}
      <Box sx={{ position:'relative', display:{ xs:'none', md:'block' } }}>
        <Image
          src={Hero}
          alt="Logística NapaviTruck"
          fill
          style={{ objectFit:'cover' }}
          priority
        />
        <Box sx={{
          position:'absolute', inset:0,
          background:'linear-gradient(120deg, rgba(14,34,68,.7), rgba(14,34,68,.25))',
        }} />
        <Box sx={{ position:'absolute', bottom:24, left:24, right:24, color:'#FFF' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb:.5 }}>Bienvenido</Typography>
          <Typography variant="body2" sx={{ opacity:.9 }}>
            Esta es tu consola para gestionar el sistema completo.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
