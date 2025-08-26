'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box, Paper, Typography, Stack, TextField, Button, Alert,
} from '@mui/material';

export default function AdminLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/admin'; // ajusta cuando tengas dashboard admin

  const [rut, setRut] = React.useState('');
  const [pin, setPin] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const onSubmit = async () => {
    try {
      setLoading(true);
      setErr(null);

      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${api}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut, pin }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json() as { access_token: string; rol: string; nombre?: string; };

      if (data.rol === 'SUPERADMIN') {
        setErr('Este acceso es para Administradores de Flota. Usa el portal de Superadmin.');
        return;
      }

      // Sesión del admin/flota (npv_*)
      sessionStorage.setItem('npv_token', data.access_token);
      sessionStorage.setItem('npv_role', data.rol);
      if (data.nombre) sessionStorage.setItem('npv_nombre', data.nombre);

      router.replace(next);
    } catch (e) {
      setErr('Credenciales inválidas o error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight:'100dvh', display:'grid', placeItems:'center', bgcolor:'#F5F7FA', p:2 }}>
      <Paper elevation={0} sx={{ p:3, borderRadius:3, border:'1px solid #E6E9EE', width:420, maxWidth:'100%' }}>
        <Typography variant="h6" sx={{ fontWeight:800, mb:1 }}>Ingresar — Administrador de Flota</Typography>
        <Typography variant="body2" sx={{ color:'text.secondary', mb:2 }}>RUT + PIN</Typography>
        <Stack spacing={1.5}>
          <TextField label="RUT" value={rut} onChange={(e)=>setRut(e.target.value)} />
          <TextField label="PIN" type="password" value={pin} onChange={(e)=>setPin(e.target.value)} />
          {err && <Alert severity="error">{err}</Alert>}
          <Button variant="contained" onClick={onSubmit} disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
